import * as Yup from "yup";
import { UPDATE_ARTIST_PROFILE_MESSAGES } from "../constants/message";

export const updateArtistProfileSchema = Yup.object().shape({
  email: Yup.string()
    .trim()
    .email(UPDATE_ARTIST_PROFILE_MESSAGES.EMAIL_IS_INVALID)
    .optional(),
});
