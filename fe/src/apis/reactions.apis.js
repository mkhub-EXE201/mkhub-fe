import http from "../utils/http";

export const reactionRoute = "reactions";

const reactionApis = {
  addReaction: (body) => http.post(`${reactionRoute}/add`, body),
  deleteReaction: (reaction_id) =>
    http.delete(`${reactionRoute}/${reaction_id}`),
};
export default reactionApis;
