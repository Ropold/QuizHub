import artPic from "../../assets/categoryEnumImages/art.jpg";
import generalKnowledgePic from "../../assets/categoryEnumImages/general-knowlege.jpg";
import geographyPic from "../../assets/categoryEnumImages/geography.jpg";
import historyPic from "../../assets/categoryEnumImages/history.jpg";
import literaturePic from "../../assets/categoryEnumImages/literature.jpg";
import mathematicsPic from "../../assets/categoryEnumImages/mathematics.jpg";
import moviesAndTvPic from "../../assets/categoryEnumImages/movies-and-tv.jpg";
import musicPic from "../../assets/categoryEnumImages/music.jpg";
import politicsPic from "../../assets/categoryEnumImages/politics.jpg";
import sciencePic from "../../assets/categoryEnumImages/science.jpg";
import sportsPic from "../../assets/categoryEnumImages/sports.jpg";
import kangarooPic from "../../assets/categoryEnumImages/kangaroo.jpg";

import type {CategoryEnum} from "../model/CategoryEnum.ts";

export const categoryEnumImages: Record<CategoryEnum, string> = {
    KANGAROO: kangarooPic,
    ART: artPic,
    GENERAL_KNOWLEDGE: generalKnowledgePic,
    GEOGRAPHY: geographyPic,
    HISTORY: historyPic,
    LITERATURE: literaturePic,
    MATHEMATICS: mathematicsPic,
    MOVIES_AND_TV: moviesAndTvPic,
    MUSIC: musicPic,
    POLITICS: politicsPic,
    SCIENCE: sciencePic,
    SPORTS: sportsPic,
}