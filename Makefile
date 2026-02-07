# Makefile for STOPRO Project

# Variables
DC = docker-compose

# Colors
GREEN = \033[0;32m
NC = \033[0m # No Color

.PHONY: help build start stop restart status logs clean

help: ## Show this help
	@echo "Usage: make [target]"
	@echo ""
	@echo "Targets:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  ${GREEN}%-15s${NC} %s\n", $$1, $$2}'

build: ## Build all services
	@echo "${GREEN}Building services...${NC}"
	$(DC) build

start: ## Start all services in detached mode
	@echo "${GREEN}Starting services...${NC}"
	$(DC) up -d

stop: ## Stop all services
	@echo "${GREEN}Stopping services...${NC}"
	$(DC) down

restart: stop start ## Restart all services

rebuild: ## Force rebuild and start
	@echo "${GREEN}Rebuilding and starting services...${NC}"
	$(DC) up -d --build --force-recreate

status: ## Show status of containers
	$(DC) ps

logs: ## Follow logs of all services
	$(DC) logs -f

clean: ## Stop and remove containers, networks, images, and volumes
	@echo "${GREEN}Cleaning up...${NC}"
	$(DC) down -v --rmi all --remove-orphans
