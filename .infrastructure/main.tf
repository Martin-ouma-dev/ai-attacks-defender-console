terraform {
  required_version = ">= 1.6.0"
}

module "dmz_edge" {
  source = "./modules/dmz_edge"
}

module "secure_app_zone" {
  source = "./modules/secure_app_zone"
}

module "core_isolated_zone" {
  source = "./modules/core_isolated_zone"
}
