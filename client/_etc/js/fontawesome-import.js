"use strict";

import { library } from "@fortawesome/fontawesome-svg-core";
import { faLock } from "@fortawesome/pro-solid-svg-icons/faLock";
import { faLock as faLockLight } from "@fortawesome/pro-light-svg-icons/faLock";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(
	faLock,
	faLockLight
);

export default FontAwesomeIcon;