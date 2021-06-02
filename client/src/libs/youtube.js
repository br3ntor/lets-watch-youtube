export default async function getVideoData(videos) {
  const resource = "https://www.googleapis.com/youtube/v3/videos";
  const part = "part=snippet";
  const id = videos.toString();
  const key = "AIzaSyCN_A0OB8dFlLjs5oENpuHT-ZCfKf1wupk";
  const url = `${resource}?${part}&id=${id}&key=${key}`;
  const response = await fetch(url);
  return response.json();
}
