"use strict";

import mutations from "../constants/mutation-types.js";
import { mapMutations } from "vuex";

export default mapMutations("i18n", Object.keys(mutations).map(mutation => mutations[mutation]));