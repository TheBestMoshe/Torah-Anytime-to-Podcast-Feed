export type Lecture = {
  lectureTitle: string;
  imagepath: string;
  playerimage: string;
  speakername: string;
  date: string;
  category: string;
  language: string;
  length: string;
  mediatype: string;
  video_id: string;
  videoUrl: string;
};

export type SpeakerLectureResults = {
  SpeakeVideoDetail: {
    speakerDetail: {
      speakerid: string;
      speakerName: string;
      speakerimage: string;
      description: string;
      gender: string;
      lecture: string;
    };
    speakerVideoList: Array<Lecture>;
  };
};

export type VideoInfo = [
  {
    ID: string;
    AudioUrl: string;
    shareurl: string;
    shareurlaudio: string;
    imagepath: string;
    playerimage: string;
    category: string;
    "sub-category": string;
    date: string;
    length: string;
    speakerid: string;
    follow: string;
    speakername: string;
    language: string;
    title: string;
  }
];

export type LectureDetailsResults = {
  VideoInfo: {
    videoinfo: VideoInfo;
  };
};

export type Speaker = {
  speakername: string;
  Lastname: string;
  gender: "male" | "female";
  speakerimage: string;
  follow: boolean;
  speakerid: string;
  lecture: string;
};

export type SpeakersResults = {
  speakers: Array<Speaker>;
};
