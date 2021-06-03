export default async function getVideoData(videos) {
  const resource = "https://www.googleapis.com/youtube/v3/videos";
  const part = "part=snippet";
  const id = videos.toString();
  const key =
    process.env.NODE_ENV === "production"
      ? process.env.REACT_APP_YTP
      : process.env.REACT_APP_YTD;
  const url = `${resource}?${part}&id=${id}&key=${key}`;
  const response = await fetch(url);
  return response.json();
}
