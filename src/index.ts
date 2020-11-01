import express from "express";
import Podcast from "podcast";
import Axios, { AxiosResponse } from "axios";
import { LectureDetailsResults, SpeakerLectureResults } from "./types";

const baseUrl = "https://to-rss-dev-pl2avrgeca-uc.a.run.app";
const app = express();

app.get("/speakers/:speakerId/rss", async (req, resp) => {
  const speakerId = req.params.speakerId;

  // Get lectures
  let response: any = null;

  response = await Axios.post(
    "https://www.torahanytime.com/webservice_2.php?action=getSpeakerDetail",
    {
      language: [7, 1, 14, 10, 15, 12, 5, 11, 3, 16, 4, 8, 9, 13],
      limit: 50,
      speakerid: speakerId,
      userid: 1,
    }
  ).catch((e) => console.log(e));

  const speakerLectureResults = response.data as SpeakerLectureResults;
  const speakerDetails = speakerLectureResults.SpeakeVideoDetail.speakerDetail;
  const feed = new Podcast({
    title: speakerDetails.speakerName,
    description: `${speakerDetails.speakerName} is a lecturer on Torah Anytime`,
    feedUrl: `${baseUrl}/speakers/${speakerId}/rss`,
    siteUrl: `https://www.torahanytime.com/#/speaker?l=${speakerId}`,
    imageUrl: speakerDetails.speakerimage,
    author: speakerDetails.speakerName,
    // categories: [],
    // pubDate: "",
    ttl: 60,
  });

  const lectures = speakerLectureResults.SpeakeVideoDetail.speakerVideoList;

  const lectureRequests: Array<Promise<AxiosResponse<any>>> = [];
  lectures.forEach((lecture) => {
    // Get the lecture
    lectureRequests.push(
      Axios.post(
        "https://www.torahanytime.com/webservice_2.php?action=getVideoDetails",
        {
          language: [7, 1, 14, 10, 15, 12, 5, 11, 3, 16, 4, 8, 9, 13],
          quality: "low",
          video_id: lecture.video_id,
        }
      )
    );
  });

  const lectureResponses = await Axios.all(lectureRequests);

  lectureResponses.forEach((results) => {
    const lectureDetailResults = results.data as LectureDetailsResults;
    const lectureDetails = lectureDetailResults.VideoInfo.videoinfo[0];
    feed.addItem({
      title: lectureDetails.title,
      url: lectureDetails.AudioUrl,
      guid: lectureDetails.ID,
      categories: [lectureDetails.category],
      date: lectureDetails.date,
      author: lectureDetails.speakername,
      enclosure: {
        url: lectureDetails.AudioUrl,
        type: "audio/mpeg",
      },
    });
  });

  const xml = feed.buildXml();
  resp.type("application/xml").send(xml);
});

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log("Running");
});
