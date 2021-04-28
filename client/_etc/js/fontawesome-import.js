"use strict";

import { library } from "@fortawesome/fontawesome-svg-core";

import { faEye } from "@fortawesome/pro-light-svg-icons/faEye";
import { faEyeSlash } from "@fortawesome/pro-light-svg-icons/faEyeSlash";


import { faLock } from "@fortawesome/pro-solid-svg-icons/faLock";
import { faSpinnerThird } from "@fortawesome/pro-solid-svg-icons/faSpinnerThird";
import { faUserPlus } from "@fortawesome/pro-solid-svg-icons/faUserPlus";
import { faSealExclamation } from "@fortawesome/pro-solid-svg-icons/faSealExclamation";

import { faGoogle } from "@fortawesome/free-brands-svg-icons/faGoogle";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(
	faEye,
	faEyeSlash,
	faLock,
	faSpinnerThird,
	faUserPlus,
	faSealExclamation,
	faGoogle
);

export default FontAwesomeIcon;