terraform {
  backend "remote" {
    organization = "TheBestMoshe"

    workspaces {
      name = "Torah-Anytime-to-Podcast"
    }
  }
}

provider "google" {
  project = var.project_name
  region  = var.region
  zone    = var.zone
}






