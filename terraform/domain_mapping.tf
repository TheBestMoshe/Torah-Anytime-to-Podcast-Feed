

resource "google_cloud_run_domain_mapping" "rss-service" {
  location = var.region
  name     = "beta.torahanytimetopodcast.2159295.xyz"

  metadata {
    namespace = var.project_name
    annotations = {
      "run.googleapis.com/launch-stage" = "BETA"
    }
  }

  spec {
    route_name = google_cloud_run_service.beta-rss-service.name
  }

  # Added because of a bug
  # https://github.com/hashicorp/terraform-provider-google/issues/7518#issuecomment-712867246
  lifecycle {
    ignore_changes = [
      metadata[0].annotations,
      metadata[0].annotations["serving.knative.dev/creator"],
      metadata[0].annotations["serving.knative.dev/lastModifier"]
    ]
  }
}
