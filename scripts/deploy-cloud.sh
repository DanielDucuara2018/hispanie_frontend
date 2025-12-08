#!/bin/bash

# Google Cloud Storage deployment script for Hispanie static assets

set -e

# Function to show usage
show_usage() {
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  -p, --project PROJECT      GCP project ID (auto-fetches bucket from Terraform)"
    echo "  -b, --bucket BUCKET        GCS bucket name (optional if using -p)"
    echo "  --api-url URL             API URL (optional, defaults from Terraform or env)"
    echo "  -t, --terraform-dir DIR   Path to Terraform directory (default: ../hispanie_infrastructure)"
    echo "  --skip-build              Skip Docker build and use existing build-output"
    echo "  --no-cleanup              Don't cleanup temporary files"
    echo "  --no-auto-fetch           Don't automatically fetch config from Terraform"
    echo "  -h, --help                Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 -p my-project-id                    # Auto-fetch bucket and URLs from Terraform"
    echo "  $0 -b hispanie-frontend-bucket         # Manual bucket name"
    echo "  $0 -p my-project-id --skip-build       # Use existing build"
}

# Default configuration
DOCKER_IMAGE="hispanie-frontend"
CONTAINER_NAME="temp-build-container"
PROJECT_ID=""
BUCKET=""
SKIP_BUILD=false
NO_CLEANUP=false
AUTO_FETCH_CONFIG=true
TERRAFORM_DIR="../hispanie_infrastructure"

# API configuration (can be fetched from Terraform or use defaults)
API_URL="${REACT_APP_HISPANIE_API_URL_ENV:-}"

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -p|--project)
            PROJECT_ID="$2"
            shift 2
            ;;
        -b|--bucket)
            BUCKET="$2"
            shift 2
            ;;
        --api-url)
            API_URL="$2"
            shift 2
            ;;
        -t|--terraform-dir)
            TERRAFORM_DIR="$2"
            shift 2
            ;;
        --skip-build)
            SKIP_BUILD=true
            shift
            ;;
        --no-cleanup)
            NO_CLEANUP=true
            shift
            ;;
        --no-auto-fetch)
            AUTO_FETCH_CONFIG=false
            shift
            ;;
        -h|--help)
            show_usage
            exit 0
            ;;
        *)
            echo "❌ Unknown option: $1"
            show_usage
            exit 1
            ;;
    esac
done

# Fetch configuration from Terraform if project ID is provided
if [[ -n "$PROJECT_ID" && "$AUTO_FETCH_CONFIG" == "true" ]]; then
    echo "🔍 Fetching configuration from Terraform..."
    
    if [[ ! -d "$TERRAFORM_DIR" ]]; then
        echo "⚠️  Warning: Terraform directory not found at $TERRAFORM_DIR"
        echo "   Use -t to specify the correct path, or provide -b manually"
    else
        CURRENT_DIR=$(pwd)
        cd "$TERRAFORM_DIR"
        
        # Check if terraform state exists
        if terraform show &> /dev/null; then
            # Get bucket name from Terraform
            if [[ -z "$BUCKET" ]]; then
                BUCKET=$(terraform output -raw frontend_bucket_name 2>/dev/null)
                if [[ -n "$BUCKET" && "$BUCKET" != "null" ]]; then
                    echo "   ✅ Bucket name: $BUCKET"
                else
                    echo "   ⚠️  Could not fetch bucket name from Terraform"
                fi
            fi
            
            # Get API URL from Terraform variables if not provided
            if [[ -z "$API_URL" ]]; then
                # Try to get from terraform.tfvars
                API_SUBDOMAIN=$(grep 'api_subdomain' terraform.tfvars 2>/dev/null | cut -d'"' -f2)
                if [[ -n "$API_SUBDOMAIN" ]]; then
                    API_URL="https://${API_SUBDOMAIN}"
                    echo "   ✅ API URL: $API_URL"
                fi
            fi
        else
            echo "   ⚠️  No Terraform state found in $TERRAFORM_DIR"
            echo "   Please run 'cd $TERRAFORM_DIR && terraform apply' first"
        fi
        
        cd "$CURRENT_DIR"
    fi
fi

# Set defaults if still empty
if [[ -z "$API_URL" ]]; then
    API_URL="https://api.hispanie.com"
    echo "   Using default API URL: $API_URL"
fi

# Validate required arguments
if [[ -z "$BUCKET" ]]; then
    echo "❌ Error: Bucket name is required"
    echo "   Either provide -p PROJECT_ID (auto-fetch from Terraform)"
    echo "   Or provide -b BUCKET_NAME (manual)"
    show_usage
    exit 1
fi

# Check if gsutil is installed
if ! command -v gsutil &> /dev/null; then
    echo "❌ Error: Google Cloud SDK (gsutil) is not installed"
    echo "Install it from: https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Build stage
if [[ "$SKIP_BUILD" == false ]]; then
    echo "🏗️  Building optimized assets for GCS deployment..."
    echo "   API URL: ${API_URL}"
    echo "   Bucket: ${BUCKET}"

    # Set PUBLIC_URL for correct asset paths in Cloud Storage
    PUBLIC_URL="https://storage.googleapis.com/${BUCKET}"

    docker build -f Dockerfile.cloud \
        --build-arg REACT_APP_HISPANIE_API_URL_ENV="${API_URL}" \
        --build-arg PUBLIC_URL="${PUBLIC_URL}" \
        -t ${DOCKER_IMAGE}:cloud .

    echo "📦 Extracting build artifacts..."
    docker create --name ${CONTAINER_NAME} ${DOCKER_IMAGE}:cloud
    docker cp ${CONTAINER_NAME}:/build ./build-output
    docker rm ${CONTAINER_NAME}
else
    echo "⏭️  Skipping build, using existing build-output..."
    if [[ ! -d "./build-output" ]]; then
        echo "❌ Error: build-output directory not found. Run without --skip-build first."
        exit 1
    fi
fi

echo "✅ Build artifacts ready in ./build-output/"

# Deploy to Google Cloud Storage
echo "☁️  Deploying to Google Cloud Storage..."

# Sync files to GCS
gsutil -m rsync -r -d ./build-output gs://${BUCKET}

# Set cache control headers
echo "🔧 Setting cache headers..."
gsutil -m setmeta -h "Cache-Control:public, max-age=31536000, immutable" "gs://${BUCKET}/static/**" 2>/dev/null || true
gsutil -m setmeta -h "Cache-Control:public, max-age=300, must-revalidate" "gs://${BUCKET}/*.html" 2>/dev/null || true

echo "✅ GCS deployment complete!"
echo "📁 Static files deployed to: gs://${BUCKET}"
echo "🌐 Bucket URL: https://storage.googleapis.com/${BUCKET}/index.html"

# Cleanup
if [[ "$NO_CLEANUP" == false ]]; then
    echo "🧹 Cleaning up..."
    if [[ "$SKIP_BUILD" == false ]]; then
        docker rmi ${DOCKER_IMAGE}:cloud 2>/dev/null || true
    fi
    rm -rf ./build-output
else
    echo "⚠️  Skipping cleanup, build-output directory preserved"
fi

echo "✨ Done!"
