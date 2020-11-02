import express from "express";
import Podcast from "podcast";
import Axios, { AxiosResponse } from "axios";
import exphbs from "express-handlebars";
import useragent from "express-useragent";

import {
  LectureDetailsResults,
  SpeakerLectureResults,
  SpeakersResults,
} from "./types";
import path from "path";

const baseUrl = "https://to-rss-dev-pl2avrgeca-uc.a.run.app";
const app = express();

app.use("/static", express.static("public"));

app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "../views"));
app.engine(
  "hbs",
  exphbs({
    // defaultLayout: "index",
    extname: "hbs",
    layoutsDir: path.join(__dirname, "../views/layouts"),
    partialsDir: path.join(__dirname, "../views"),
  })
);

app.use(useragent.express());

app.get("/", async (req, resp) => {
  // Get all the speakers
  const response = await Axios.post(
    "https://www.torahanytime.com/webservice_2.php?action=getSpeakers"
  );

  const speakerResults = response.data as SpeakersResults;
  const speakers = speakerResults.speakers;

  const useragent = req.useragent;
  console.log(useragent);
  resp
    .set("Cache-Control", "public, max-age=3600")
    .render("home", { speakers: speakers, useragent: useragent });
});

app.get("/speakers/:speakerId", async (req, resp) => {
  const speakerId = req.params.speakerId;
  const response = await Axios.post(
    "https://www.torahanytime.com/webservice_2.php?action=getSpeakerDetail",
    {
      language: [7, 1, 14, 10, 15, 12, 5, 11, 3, 16, 4, 8, 9, 13],
      limit: 50,
      speakerid: speakerId,
      userid: 1,
    }
  );

  const speakerLectureResults = response.data as SpeakerLectureResults;
  const speakerDetails = speakerLectureResults.SpeakeVideoDetail.speakerDetail;
  const lectures = speakerLectureResults.SpeakeVideoDetail.speakerVideoList;

  resp
    .set("Cache-Control", "public, max-age=3600")
    .render("speakerPage", { speaker: speakerDetails, lectures: lectures });
});

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
    generator: "Torah Anytime to Podcast",
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
  resp
    .set("Cache-Control", "public, max-age=18000")
    .type("application/xml")
    .send(xml);
});

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log("Running");
});
