data "google_iam_policy" "noauth" {
  binding {
    role = "roles/run.invoker"
    members = [
      "allUsers",
    ]
  }
}

resource "google_cloud_run_service_iam_policy" "noauth" {
  location = google_cloud_run_service.rss-service.location
  project  = google_cloud_run_service.rss-service.project
  service  = google_cloud_run_service.rss-service.name

  policy_data = data.google_iam_policy.noauth.policy_data
}
