"use strict";

import { library } from "@fortawesome/fontawesome-svg-core";

import { faEye } from "@fortawesome/pro-light-svg-icons/faEye";
import { faEyeSlash } from "@fortawesome/pro-light-svg-icons/faEyeSlash";
import { faBars } from "@fortawesome/pro-light-svg-icons/faBars";
import { faXmark } from "@fortawesome/pro-light-svg-icons/faXmark";

import { faUserTie } from "@fortawesome/pro-solid-svg-icons/faUserTie";
import { faUserGroupCrown } from "@fortawesome/pro-solid-svg-icons/faUserGroupCrown";
import { faPodcast } from "@fortawesome/pro-solid-svg-icons/faPodcast";
import { faHome } from "@fortawesome/pro-solid-svg-icons/faHome";
import { faBallPile } from "@fortawesome/pro-solid-svg-icons/faBallPile";
import { faBoxArchive } from "@fortawesome/pro-solid-svg-icons/faBoxArchive";


import { faLock } from "@fortawesome/pro-solid-svg-icons/faLock";
import { faSpinnerThird } from "@fortawesome/pro-solid-svg-icons/faSpinnerThird";
import { faUserPlus } from "@fortawesome/pro-solid-svg-icons/faUserPlus";
import { faSealExclamation } from "@fortawesome/pro-solid-svg-icons/faSealExclamation";

import { faGoogle } from "@fortawesome/free-brands-svg-icons/faGoogle";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(
	faEye,
	faEyeSlash,
	faBars,
	faXmark,

	faUserTie,
	faUserGroupCrown,
	faPodcast,
	faHome,
	faBallPile,
	faBoxArchive,

	faLock,
	faSpinnerThird,
	faUserPlus,
	faSealExclamation,
	faGoogle
);

export default FontAwesomeIcon;