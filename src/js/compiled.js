/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

// --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---
// MARK: - Blueprint functions
/** Format object to pretty JSON */
Pulsar.registerFunction("objectToPrettyJson", (object) => {
    return JSON.stringify(object, null, 2);
});
/** Generate style dictionary tree */
Pulsar.registerFunction("generateStyleDictionaryTree", (rootGroup, allTokens, allGroups) => {
    let writeRoot = {};
    // Compute full data structure of the entire type-dependent tree
    let result = representTree(rootGroup, allTokens, allGroups, writeRoot);
    // Add top level entries which don't belong to any user-defined group
    for (let token of tokensOfGroup(rootGroup, allTokens)) {
        result[`leaf-${safeTokenName(token)}`] = representToken(token, allTokens, allGroups);
    }
    // Retrieve
    return {
        [`${typeLabel(rootGroup.tokenType)}`]: result,
    };
});
// --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---
// MARK: - Tree construction
/** Construct tree out of one specific group, independent of tree type */
function representTree(rootGroup, allTokens, allGroups, writeObject) {
    // Represent one level of groups and tokens inside tree. Creates subobjects and then also information about each token
    for (let group of rootGroup.subgroups) {
        // Write buffer
        let writeSubObject = {};
        // Add each entry for each subgroup, and represent its tree into it
        writeObject[safeGroupName(group)] = representTree(group, allTokens, allGroups, writeSubObject);
        // Add each entry for each token, writing to the same write root
        for (let token of tokensOfGroup(group, allTokens)) {
            writeSubObject[safeTokenName(token)] = representToken(token, allTokens, allGroups);
        }
    }
    return writeObject;
}
// --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---
// MARK: - Token Representation
/** Represent a singular token as SD object */
function representToken(token, allTokens, allGroups) {
    switch (token.tokenType) {
        case "Color":
            return representColorToken(token, allTokens, allGroups);
        case "Border":
            return representBorderToken(token, allTokens, allGroups);
        case "Font":
            return representFontToken(token, allTokens, allGroups);
        case "Gradient":
            return representGradientToken(token, allTokens, allGroups);
        case "Measure":
            return representMeasureToken(token, allTokens, allGroups);
        case "Radius":
            return representRadiusToken(token, allTokens, allGroups);
        case "Shadow":
            return representShadowToken(token, allTokens, allGroups);
        case "Text":
            return representTextToken(token, allTokens, allGroups);
        case "Typography":
            return representTypographyToken(token, allTokens, allGroups);
    }
}
/** Represent full color token, including wrapping meta-information such as user description */
function representColorToken(token, allTokens, allGroups) {
    let value = representColorTokenValue(token.value, allTokens, allGroups);
    return tokenWrapper(token, value);
}
/** Represent full border token, including wrapping meta-information such as user description */
function representBorderToken(token, allTokens, allGroups) {
    let value = representBorderTokenValue(token.value, allTokens, allGroups);
    return tokenWrapper(token, value);
}
/** Represent full font token, including wrapping meta-information such as user description */
function representFontToken(token, allTokens, allGroups) {
    let value = representFontTokenValue(token.value, allTokens, allGroups);
    return tokenWrapper(token, value);
}
/** Represent full gradient token, including wrapping meta-information such as user description */
function representGradientToken(token, allTokens, allGroups) {
    let value = representGradientTokenValue(token.value, allTokens, allGroups);
    return tokenWrapper(token, value);
}
/** Represent full measure token, including wrapping meta-information such as user description */
function representMeasureToken(token, allTokens, allGroups) {
    let value = representMeasureTokenValue(token.value, allTokens, allGroups);
    return tokenWrapper(token, value);
}
/** Represent full radius token, including wrapping meta-information such as user description */
function representRadiusToken(token, allTokens, allGroups) {
    let value = representRadiusTokenValue(token.value, allTokens, allGroups);
    return tokenWrapper(token, value);
}
/** Represent full shadow token, including wrapping meta-information such as user description */
function representShadowToken(token, allTokens, allGroups) {
    let value = representShadowTokenValue(token.value, allTokens, allGroups);
    return tokenWrapper(token, value);
}
/** Represent full text token, including wrapping meta-information such as user description */
function representTextToken(token, allTokens, allGroups) {
    let value = representTextTokenValue(token.value, allTokens, allGroups);
    return tokenWrapper(token, value);
}
/** Represent full typography token, including wrapping meta-information such as user description */
function representTypographyToken(token, allTokens, allGroups) {
    let value = representTypographyTokenValue(token.value, allTokens, allGroups);
    return tokenWrapper(token, value);
}
// --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---
// MARK: - Token Value Representation
/** Represent color token value either as reference or as plain representation */
function representColorTokenValue(value, allTokens, allGroups) {
    let result;
    if (value.referencedToken) {
        // Forms reference
        result = referenceWrapper(referenceName(value.referencedToken, allGroups));
    }
    else {
        // Raw value
        result = `#${value.hex}`;
    }
    return result;
}
/** Represent radius token value either as reference or as plain representation */
function representRadiusTokenValue(value, allTokens, allGroups) {
    let result;
    if (value.referencedToken) {
        // Forms reference
        result = referenceWrapper(referenceName(value.referencedToken, allGroups));
    }
    else {
        // Raw value
        result = {
            radius: {
                type: "measure",
                value: representMeasureTokenValue(value.radius, allTokens, allGroups),
            },
            topLeft: value.topLeft
                ? {
                    type: "measure",
                    value: representMeasureTokenValue(value.topLeft, allTokens, allGroups),
                }
                : undefined,
            topRight: value.topRight
                ? {
                    type: "measure",
                    value: representMeasureTokenValue(value.topRight, allTokens, allGroups),
                }
                : undefined,
            bottomLeft: value.bottomLeft
                ? {
                    type: "measure",
                    value: representMeasureTokenValue(value.bottomLeft, allTokens, allGroups),
                }
                : undefined,
            bottomRight: value.bottomRight
                ? {
                    type: "measure",
                    value: representMeasureTokenValue(value.bottomRight, allTokens, allGroups),
                }
                : undefined,
        };
    }
    return result;
}
/** Represent measure token value either as reference or as plain representation */
function representMeasureTokenValue(value, allTokens, allGroups) {
    let result;
    if (value.referencedToken) {
        // Forms reference
        result = referenceWrapper(referenceName(value.referencedToken, allGroups));
    }
    else {
        // Raw value
        result = {
            measure: {
                type: "size",
                value: value.measure,
            },
            unit: {
                type: "string",
                value: value.unit.toLowerCase(),
            },
        };
    }
    return result;
}
/** Represent font token value either as reference or as plain representation */
function representFontTokenValue(value, allTokens, allGroups) {
    let result;
    if (value.referencedToken) {
        // Forms reference
        result = referenceWrapper(referenceName(value.referencedToken, allGroups));
    }
    else {
        // Raw value
        result = {
            family: {
                type: "string",
                value: value.family,
            },
            subfamily: {
                type: "string",
                value: value.subfamily,
            },
        };
    }
    return result;
}
/** Represent text token value either as reference or as plain representation */
function representTextTokenValue(value, allTokens, allGroups) {
    let result;
    if (value.referencedToken) {
        // Forms reference
        result = referenceWrapper(referenceName(value.referencedToken, allGroups));
    }
    else {
        // Raw value
        result = value.text;
    }
    return result;
}
/** Represent typography token value either as reference or as plain representation */
function representTypographyTokenValue(value, allTokens, allGroups) {
    let result;
    if (value.referencedToken) {
        // Forms reference
        result = referenceWrapper(referenceName(value.referencedToken, allGroups));
    }
    else {
        // Raw value
        result = {
            font: {
                type: "font",
                value: representFontTokenValue(value.font, allTokens, allGroups),
            },
            fontSize: {
                type: "measure",
                value: representMeasureTokenValue(value.fontSize, allTokens, allGroups),
            },
            textDecoration: value.textDecoration,
            textCase: value.textCase,
            letterSpacing: {
                type: "measure",
                value: representMeasureTokenValue(value.letterSpacing, allTokens, allGroups),
            },
            paragraphIndent: {
                type: "measure",
                value: representMeasureTokenValue(value.paragraphIndent, allTokens, allGroups),
            },
            lineHeight: value.lineHeight
                ? {
                    type: "measure",
                    value: representMeasureTokenValue(value.lineHeight, allTokens, allGroups),
                }
                : undefined,
        };
    }
    return result;
}
/** Represent border token value either as reference or as plain representation */
function representBorderTokenValue(value, allTokens, allGroups) {
    let result;
    if (value.referencedToken) {
        // Forms reference
        result = referenceWrapper(referenceName(value.referencedToken, allGroups));
    }
    else {
        // Raw value
        result = {
            color: {
                type: "color",
                value: representColorTokenValue(value.color, allTokens, allGroups),
            },
            width: {
                type: "measure",
                value: representMeasureTokenValue(value.width, allTokens, allGroups),
            },
            position: {
                type: "string",
                value: value.position,
            },
        };
    }
    return result;
}
/** Represent shadow token value either as reference or as plain representation */
function representShadowTokenValue(value, allTokens, allGroups) {
    let result;
    if (value.referencedToken) {
        // Forms reference
        result = referenceWrapper(referenceName(value.referencedToken, allGroups));
    }
    else {
        // Raw value
        result = {
            color: {
                type: "color",
                value: representColorTokenValue(value.color, allTokens, allGroups),
            },
            x: {
                type: "measure",
                value: representMeasureTokenValue(value.x, allTokens, allGroups),
            },
            y: {
                type: "measure",
                value: representMeasureTokenValue(value.y, allTokens, allGroups),
            },
            radius: {
                type: "measure",
                value: representMeasureTokenValue(value.radius, allTokens, allGroups),
            },
            spread: {
                type: "measure",
                value: representMeasureTokenValue(value.spread, allTokens, allGroups),
            },
            opacity: {
                type: "size",
                value: value.opacity,
            },
        };
    }
    return result;
}
/** Represent gradient token value either as reference or as plain representation */
function representGradientTokenValue(value, allTokens, allGroups) {
    let result;
    if (value.referencedToken) {
        // Forms reference
        result = referenceWrapper(referenceName(value.referencedToken, allGroups));
    }
    else {
        // Raw value
        result = {
            to: {
                type: "point",
                value: {
                    x: {
                        type: "size",
                        value: value.to.x,
                    },
                    y: {
                        type: "size",
                        value: value.to.y,
                    },
                },
            },
            from: {
                type: "point",
                value: {
                    x: {
                        type: "size",
                        value: value.from.x,
                    },
                    y: {
                        type: "size",
                        value: value.from.y,
                    },
                },
            },
            type: {
                type: "string",
                value: value.type,
            },
            aspectRatio: {
                type: "size",
                value: value.aspectRatio,
            },
            stops: {},
        };
        // Inject gradient stops
        let count = 0;
        for (let stop of value.stops) {
            let stopObject = {
                type: "gradientStop",
                position: {
                    type: "size",
                    value: stop.position,
                },
                color: {
                    type: "color",
                    value: representColorTokenValue(stop.color, allTokens, allGroups),
                },
            };
            result.stops[`${count}`] = stopObject;
            count++;
        }
    }
    return result;
}
// --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---
// MARK: - Object wrappers
/** Retrieve wrapper to certain token (referenced by name) pointing to token value */
function referenceWrapper(reference) {
    return `{${reference}.value}`;
}
/** Retrieve token wrapper containing its metadata and value information (used as container for each defined token) */
function tokenWrapper(token, value) {
    return {
        value: value,
        type: typeLabel(token.tokenType),
        comment: token.description.length > 0 ? token.description : undefined,
    };
}
// --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---
// MARK: - Naming
/** Create full reference name representing token. Such name can, for example, look like: [g1].[g2].[g3].[g4].[token-name] */
function referenceName(token, allGroups) {
    // Find the group to which token belongs. This is really suboptimal and should be solved by the SDK to just provide the group reference
    let occurances = allGroups.filter((g) => g.tokenIds.indexOf(token.id) !== -1);
    if (occurances.length === 0) {
        throw Error("JS: Unable to find token in any of the groups");
    }
    let containingGroup = occurances[0];
    let tokenPart = safeTokenName(token);
    let groupParts = referenceGroupChain(containingGroup).map((g) => safeGroupName(g));
    return [...groupParts, tokenPart].join(".");
}
/** Retrieve safe token name made out of normal token name
 * This replace spaces with dashes, also change anything non-alphanumeric char to it as well.
 * For example, ST&RK Industries will be changed to st-rk-industries
 */
function safeTokenName(token) {
    return token.name.replace(/\W+/g, "-").toLowerCase();
}
/** Retrieve safe group name made out of normal group name
 * This replace spaces with dashes, also change anything non-alphanumeric char to it as well.
 * For example, ST&RK Industries will be changed to st-rk-industries
 */
function safeGroupName(group) {
    return group.name.replace(/\W+/g, "-").toLowerCase();
}
/** Retrieve human-readable token type in unified fashion, used both as token type and as token master group */
function typeLabel(type) {
    switch (type) {
        case "Border":
            return "border";
        case "Color":
            return "color";
        case "Font":
            return "font";
        case "Gradient":
            return "gradient";
        case "Measure":
            return "measure";
        case "Radius":
            return "radius";
        case "Shadow":
            return "shadow";
        case "Text":
            return "text";
        case "Typography":
            return "typography";
    }
}
// --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---
// MARK: - Lookup
/** Find all tokens that belong to a certain group and retrieve them as objects */
function tokensOfGroup(containingGroup, allTokens) {
    return allTokens.filter((t) => containingGroup.tokenIds.indexOf(t.id) !== -1);
}
/** Retrieve chain of groups up to a specified group, ordered from parent to children */
function referenceGroupChain(containingGroup) {
    let iteratedGroup = containingGroup;
    let chain = [containingGroup];
    while (iteratedGroup.parent) {
        chain.push(iteratedGroup.parent);
        iteratedGroup = iteratedGroup.parent;
    }
    return chain.reverse();
}


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7UUFBQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTs7O1FBR0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDBDQUEwQyxnQ0FBZ0M7UUFDMUU7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSx3REFBd0Qsa0JBQWtCO1FBQzFFO1FBQ0EsaURBQWlELGNBQWM7UUFDL0Q7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLHlDQUF5QyxpQ0FBaUM7UUFDMUUsZ0hBQWdILG1CQUFtQixFQUFFO1FBQ3JJO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMkJBQTJCLDBCQUEwQixFQUFFO1FBQ3ZELGlDQUFpQyxlQUFlO1FBQ2hEO1FBQ0E7UUFDQTs7UUFFQTtRQUNBLHNEQUFzRCwrREFBK0Q7O1FBRXJIO1FBQ0E7OztRQUdBO1FBQ0E7Ozs7Ozs7Ozs7OztBQ2xGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCLHFCQUFxQjtBQUM1QztBQUNBO0FBQ0E7QUFDQSxZQUFZLCtCQUErQjtBQUMzQztBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCLFVBQVU7QUFDL0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUI7QUFDckI7QUFDQTtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCLGlCQUFpQjtBQUNqQixhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQjtBQUNyQixpQkFBaUI7QUFDakIsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2IscUJBQXFCO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQSw0QkFBNEIsTUFBTTtBQUNsQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLEVBQUUsVUFBVSxPQUFPO0FBQ2hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImNvbXBpbGVkLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9zcmMvaW5kZXgudHNcIik7XG4iLCIvLyAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tXG4vLyBNQVJLOiAtIEJsdWVwcmludCBmdW5jdGlvbnNcbi8qKiBGb3JtYXQgb2JqZWN0IHRvIHByZXR0eSBKU09OICovXG5QdWxzYXIucmVnaXN0ZXJGdW5jdGlvbihcIm9iamVjdFRvUHJldHR5SnNvblwiLCAob2JqZWN0KSA9PiB7XG4gICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KG9iamVjdCwgbnVsbCwgMik7XG59KTtcbi8qKiBHZW5lcmF0ZSBzdHlsZSBkaWN0aW9uYXJ5IHRyZWUgKi9cblB1bHNhci5yZWdpc3RlckZ1bmN0aW9uKFwiZ2VuZXJhdGVTdHlsZURpY3Rpb25hcnlUcmVlXCIsIChyb290R3JvdXAsIGFsbFRva2VucywgYWxsR3JvdXBzKSA9PiB7XG4gICAgbGV0IHdyaXRlUm9vdCA9IHt9O1xuICAgIC8vIENvbXB1dGUgZnVsbCBkYXRhIHN0cnVjdHVyZSBvZiB0aGUgZW50aXJlIHR5cGUtZGVwZW5kZW50IHRyZWVcbiAgICBsZXQgcmVzdWx0ID0gcmVwcmVzZW50VHJlZShyb290R3JvdXAsIGFsbFRva2VucywgYWxsR3JvdXBzLCB3cml0ZVJvb3QpO1xuICAgIC8vIEFkZCB0b3AgbGV2ZWwgZW50cmllcyB3aGljaCBkb24ndCBiZWxvbmcgdG8gYW55IHVzZXItZGVmaW5lZCBncm91cFxuICAgIGZvciAobGV0IHRva2VuIG9mIHRva2Vuc09mR3JvdXAocm9vdEdyb3VwLCBhbGxUb2tlbnMpKSB7XG4gICAgICAgIHJlc3VsdFtgbGVhZi0ke3NhZmVUb2tlbk5hbWUodG9rZW4pfWBdID0gcmVwcmVzZW50VG9rZW4odG9rZW4sIGFsbFRva2VucywgYWxsR3JvdXBzKTtcbiAgICB9XG4gICAgLy8gUmV0cmlldmVcbiAgICByZXR1cm4ge1xuICAgICAgICBbYCR7dHlwZUxhYmVsKHJvb3RHcm91cC50b2tlblR5cGUpfWBdOiByZXN1bHQsXG4gICAgfTtcbn0pO1xuLy8gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLVxuLy8gTUFSSzogLSBUcmVlIGNvbnN0cnVjdGlvblxuLyoqIENvbnN0cnVjdCB0cmVlIG91dCBvZiBvbmUgc3BlY2lmaWMgZ3JvdXAsIGluZGVwZW5kZW50IG9mIHRyZWUgdHlwZSAqL1xuZnVuY3Rpb24gcmVwcmVzZW50VHJlZShyb290R3JvdXAsIGFsbFRva2VucywgYWxsR3JvdXBzLCB3cml0ZU9iamVjdCkge1xuICAgIC8vIFJlcHJlc2VudCBvbmUgbGV2ZWwgb2YgZ3JvdXBzIGFuZCB0b2tlbnMgaW5zaWRlIHRyZWUuIENyZWF0ZXMgc3Vib2JqZWN0cyBhbmQgdGhlbiBhbHNvIGluZm9ybWF0aW9uIGFib3V0IGVhY2ggdG9rZW5cbiAgICBmb3IgKGxldCBncm91cCBvZiByb290R3JvdXAuc3ViZ3JvdXBzKSB7XG4gICAgICAgIC8vIFdyaXRlIGJ1ZmZlclxuICAgICAgICBsZXQgd3JpdGVTdWJPYmplY3QgPSB7fTtcbiAgICAgICAgLy8gQWRkIGVhY2ggZW50cnkgZm9yIGVhY2ggc3ViZ3JvdXAsIGFuZCByZXByZXNlbnQgaXRzIHRyZWUgaW50byBpdFxuICAgICAgICB3cml0ZU9iamVjdFtzYWZlR3JvdXBOYW1lKGdyb3VwKV0gPSByZXByZXNlbnRUcmVlKGdyb3VwLCBhbGxUb2tlbnMsIGFsbEdyb3Vwcywgd3JpdGVTdWJPYmplY3QpO1xuICAgICAgICAvLyBBZGQgZWFjaCBlbnRyeSBmb3IgZWFjaCB0b2tlbiwgd3JpdGluZyB0byB0aGUgc2FtZSB3cml0ZSByb290XG4gICAgICAgIGZvciAobGV0IHRva2VuIG9mIHRva2Vuc09mR3JvdXAoZ3JvdXAsIGFsbFRva2VucykpIHtcbiAgICAgICAgICAgIHdyaXRlU3ViT2JqZWN0W3NhZmVUb2tlbk5hbWUodG9rZW4pXSA9IHJlcHJlc2VudFRva2VuKHRva2VuLCBhbGxUb2tlbnMsIGFsbEdyb3Vwcyk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHdyaXRlT2JqZWN0O1xufVxuLy8gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLVxuLy8gTUFSSzogLSBUb2tlbiBSZXByZXNlbnRhdGlvblxuLyoqIFJlcHJlc2VudCBhIHNpbmd1bGFyIHRva2VuIGFzIFNEIG9iamVjdCAqL1xuZnVuY3Rpb24gcmVwcmVzZW50VG9rZW4odG9rZW4sIGFsbFRva2VucywgYWxsR3JvdXBzKSB7XG4gICAgc3dpdGNoICh0b2tlbi50b2tlblR5cGUpIHtcbiAgICAgICAgY2FzZSBcIkNvbG9yXCI6XG4gICAgICAgICAgICByZXR1cm4gcmVwcmVzZW50Q29sb3JUb2tlbih0b2tlbiwgYWxsVG9rZW5zLCBhbGxHcm91cHMpO1xuICAgICAgICBjYXNlIFwiQm9yZGVyXCI6XG4gICAgICAgICAgICByZXR1cm4gcmVwcmVzZW50Qm9yZGVyVG9rZW4odG9rZW4sIGFsbFRva2VucywgYWxsR3JvdXBzKTtcbiAgICAgICAgY2FzZSBcIkZvbnRcIjpcbiAgICAgICAgICAgIHJldHVybiByZXByZXNlbnRGb250VG9rZW4odG9rZW4sIGFsbFRva2VucywgYWxsR3JvdXBzKTtcbiAgICAgICAgY2FzZSBcIkdyYWRpZW50XCI6XG4gICAgICAgICAgICByZXR1cm4gcmVwcmVzZW50R3JhZGllbnRUb2tlbih0b2tlbiwgYWxsVG9rZW5zLCBhbGxHcm91cHMpO1xuICAgICAgICBjYXNlIFwiTWVhc3VyZVwiOlxuICAgICAgICAgICAgcmV0dXJuIHJlcHJlc2VudE1lYXN1cmVUb2tlbih0b2tlbiwgYWxsVG9rZW5zLCBhbGxHcm91cHMpO1xuICAgICAgICBjYXNlIFwiUmFkaXVzXCI6XG4gICAgICAgICAgICByZXR1cm4gcmVwcmVzZW50UmFkaXVzVG9rZW4odG9rZW4sIGFsbFRva2VucywgYWxsR3JvdXBzKTtcbiAgICAgICAgY2FzZSBcIlNoYWRvd1wiOlxuICAgICAgICAgICAgcmV0dXJuIHJlcHJlc2VudFNoYWRvd1Rva2VuKHRva2VuLCBhbGxUb2tlbnMsIGFsbEdyb3Vwcyk7XG4gICAgICAgIGNhc2UgXCJUZXh0XCI6XG4gICAgICAgICAgICByZXR1cm4gcmVwcmVzZW50VGV4dFRva2VuKHRva2VuLCBhbGxUb2tlbnMsIGFsbEdyb3Vwcyk7XG4gICAgICAgIGNhc2UgXCJUeXBvZ3JhcGh5XCI6XG4gICAgICAgICAgICByZXR1cm4gcmVwcmVzZW50VHlwb2dyYXBoeVRva2VuKHRva2VuLCBhbGxUb2tlbnMsIGFsbEdyb3Vwcyk7XG4gICAgfVxufVxuLyoqIFJlcHJlc2VudCBmdWxsIGNvbG9yIHRva2VuLCBpbmNsdWRpbmcgd3JhcHBpbmcgbWV0YS1pbmZvcm1hdGlvbiBzdWNoIGFzIHVzZXIgZGVzY3JpcHRpb24gKi9cbmZ1bmN0aW9uIHJlcHJlc2VudENvbG9yVG9rZW4odG9rZW4sIGFsbFRva2VucywgYWxsR3JvdXBzKSB7XG4gICAgbGV0IHZhbHVlID0gcmVwcmVzZW50Q29sb3JUb2tlblZhbHVlKHRva2VuLnZhbHVlLCBhbGxUb2tlbnMsIGFsbEdyb3Vwcyk7XG4gICAgcmV0dXJuIHRva2VuV3JhcHBlcih0b2tlbiwgdmFsdWUpO1xufVxuLyoqIFJlcHJlc2VudCBmdWxsIGJvcmRlciB0b2tlbiwgaW5jbHVkaW5nIHdyYXBwaW5nIG1ldGEtaW5mb3JtYXRpb24gc3VjaCBhcyB1c2VyIGRlc2NyaXB0aW9uICovXG5mdW5jdGlvbiByZXByZXNlbnRCb3JkZXJUb2tlbih0b2tlbiwgYWxsVG9rZW5zLCBhbGxHcm91cHMpIHtcbiAgICBsZXQgdmFsdWUgPSByZXByZXNlbnRCb3JkZXJUb2tlblZhbHVlKHRva2VuLnZhbHVlLCBhbGxUb2tlbnMsIGFsbEdyb3Vwcyk7XG4gICAgcmV0dXJuIHRva2VuV3JhcHBlcih0b2tlbiwgdmFsdWUpO1xufVxuLyoqIFJlcHJlc2VudCBmdWxsIGZvbnQgdG9rZW4sIGluY2x1ZGluZyB3cmFwcGluZyBtZXRhLWluZm9ybWF0aW9uIHN1Y2ggYXMgdXNlciBkZXNjcmlwdGlvbiAqL1xuZnVuY3Rpb24gcmVwcmVzZW50Rm9udFRva2VuKHRva2VuLCBhbGxUb2tlbnMsIGFsbEdyb3Vwcykge1xuICAgIGxldCB2YWx1ZSA9IHJlcHJlc2VudEZvbnRUb2tlblZhbHVlKHRva2VuLnZhbHVlLCBhbGxUb2tlbnMsIGFsbEdyb3Vwcyk7XG4gICAgcmV0dXJuIHRva2VuV3JhcHBlcih0b2tlbiwgdmFsdWUpO1xufVxuLyoqIFJlcHJlc2VudCBmdWxsIGdyYWRpZW50IHRva2VuLCBpbmNsdWRpbmcgd3JhcHBpbmcgbWV0YS1pbmZvcm1hdGlvbiBzdWNoIGFzIHVzZXIgZGVzY3JpcHRpb24gKi9cbmZ1bmN0aW9uIHJlcHJlc2VudEdyYWRpZW50VG9rZW4odG9rZW4sIGFsbFRva2VucywgYWxsR3JvdXBzKSB7XG4gICAgbGV0IHZhbHVlID0gcmVwcmVzZW50R3JhZGllbnRUb2tlblZhbHVlKHRva2VuLnZhbHVlLCBhbGxUb2tlbnMsIGFsbEdyb3Vwcyk7XG4gICAgcmV0dXJuIHRva2VuV3JhcHBlcih0b2tlbiwgdmFsdWUpO1xufVxuLyoqIFJlcHJlc2VudCBmdWxsIG1lYXN1cmUgdG9rZW4sIGluY2x1ZGluZyB3cmFwcGluZyBtZXRhLWluZm9ybWF0aW9uIHN1Y2ggYXMgdXNlciBkZXNjcmlwdGlvbiAqL1xuZnVuY3Rpb24gcmVwcmVzZW50TWVhc3VyZVRva2VuKHRva2VuLCBhbGxUb2tlbnMsIGFsbEdyb3Vwcykge1xuICAgIGxldCB2YWx1ZSA9IHJlcHJlc2VudE1lYXN1cmVUb2tlblZhbHVlKHRva2VuLnZhbHVlLCBhbGxUb2tlbnMsIGFsbEdyb3Vwcyk7XG4gICAgcmV0dXJuIHRva2VuV3JhcHBlcih0b2tlbiwgdmFsdWUpO1xufVxuLyoqIFJlcHJlc2VudCBmdWxsIHJhZGl1cyB0b2tlbiwgaW5jbHVkaW5nIHdyYXBwaW5nIG1ldGEtaW5mb3JtYXRpb24gc3VjaCBhcyB1c2VyIGRlc2NyaXB0aW9uICovXG5mdW5jdGlvbiByZXByZXNlbnRSYWRpdXNUb2tlbih0b2tlbiwgYWxsVG9rZW5zLCBhbGxHcm91cHMpIHtcbiAgICBsZXQgdmFsdWUgPSByZXByZXNlbnRSYWRpdXNUb2tlblZhbHVlKHRva2VuLnZhbHVlLCBhbGxUb2tlbnMsIGFsbEdyb3Vwcyk7XG4gICAgcmV0dXJuIHRva2VuV3JhcHBlcih0b2tlbiwgdmFsdWUpO1xufVxuLyoqIFJlcHJlc2VudCBmdWxsIHNoYWRvdyB0b2tlbiwgaW5jbHVkaW5nIHdyYXBwaW5nIG1ldGEtaW5mb3JtYXRpb24gc3VjaCBhcyB1c2VyIGRlc2NyaXB0aW9uICovXG5mdW5jdGlvbiByZXByZXNlbnRTaGFkb3dUb2tlbih0b2tlbiwgYWxsVG9rZW5zLCBhbGxHcm91cHMpIHtcbiAgICBsZXQgdmFsdWUgPSByZXByZXNlbnRTaGFkb3dUb2tlblZhbHVlKHRva2VuLnZhbHVlLCBhbGxUb2tlbnMsIGFsbEdyb3Vwcyk7XG4gICAgcmV0dXJuIHRva2VuV3JhcHBlcih0b2tlbiwgdmFsdWUpO1xufVxuLyoqIFJlcHJlc2VudCBmdWxsIHRleHQgdG9rZW4sIGluY2x1ZGluZyB3cmFwcGluZyBtZXRhLWluZm9ybWF0aW9uIHN1Y2ggYXMgdXNlciBkZXNjcmlwdGlvbiAqL1xuZnVuY3Rpb24gcmVwcmVzZW50VGV4dFRva2VuKHRva2VuLCBhbGxUb2tlbnMsIGFsbEdyb3Vwcykge1xuICAgIGxldCB2YWx1ZSA9IHJlcHJlc2VudFRleHRUb2tlblZhbHVlKHRva2VuLnZhbHVlLCBhbGxUb2tlbnMsIGFsbEdyb3Vwcyk7XG4gICAgcmV0dXJuIHRva2VuV3JhcHBlcih0b2tlbiwgdmFsdWUpO1xufVxuLyoqIFJlcHJlc2VudCBmdWxsIHR5cG9ncmFwaHkgdG9rZW4sIGluY2x1ZGluZyB3cmFwcGluZyBtZXRhLWluZm9ybWF0aW9uIHN1Y2ggYXMgdXNlciBkZXNjcmlwdGlvbiAqL1xuZnVuY3Rpb24gcmVwcmVzZW50VHlwb2dyYXBoeVRva2VuKHRva2VuLCBhbGxUb2tlbnMsIGFsbEdyb3Vwcykge1xuICAgIGxldCB2YWx1ZSA9IHJlcHJlc2VudFR5cG9ncmFwaHlUb2tlblZhbHVlKHRva2VuLnZhbHVlLCBhbGxUb2tlbnMsIGFsbEdyb3Vwcyk7XG4gICAgcmV0dXJuIHRva2VuV3JhcHBlcih0b2tlbiwgdmFsdWUpO1xufVxuLy8gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLVxuLy8gTUFSSzogLSBUb2tlbiBWYWx1ZSBSZXByZXNlbnRhdGlvblxuLyoqIFJlcHJlc2VudCBjb2xvciB0b2tlbiB2YWx1ZSBlaXRoZXIgYXMgcmVmZXJlbmNlIG9yIGFzIHBsYWluIHJlcHJlc2VudGF0aW9uICovXG5mdW5jdGlvbiByZXByZXNlbnRDb2xvclRva2VuVmFsdWUodmFsdWUsIGFsbFRva2VucywgYWxsR3JvdXBzKSB7XG4gICAgbGV0IHJlc3VsdDtcbiAgICBpZiAodmFsdWUucmVmZXJlbmNlZFRva2VuKSB7XG4gICAgICAgIC8vIEZvcm1zIHJlZmVyZW5jZVxuICAgICAgICByZXN1bHQgPSByZWZlcmVuY2VXcmFwcGVyKHJlZmVyZW5jZU5hbWUodmFsdWUucmVmZXJlbmNlZFRva2VuLCBhbGxHcm91cHMpKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIC8vIFJhdyB2YWx1ZVxuICAgICAgICByZXN1bHQgPSBgIyR7dmFsdWUuaGV4fWA7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG59XG4vKiogUmVwcmVzZW50IHJhZGl1cyB0b2tlbiB2YWx1ZSBlaXRoZXIgYXMgcmVmZXJlbmNlIG9yIGFzIHBsYWluIHJlcHJlc2VudGF0aW9uICovXG5mdW5jdGlvbiByZXByZXNlbnRSYWRpdXNUb2tlblZhbHVlKHZhbHVlLCBhbGxUb2tlbnMsIGFsbEdyb3Vwcykge1xuICAgIGxldCByZXN1bHQ7XG4gICAgaWYgKHZhbHVlLnJlZmVyZW5jZWRUb2tlbikge1xuICAgICAgICAvLyBGb3JtcyByZWZlcmVuY2VcbiAgICAgICAgcmVzdWx0ID0gcmVmZXJlbmNlV3JhcHBlcihyZWZlcmVuY2VOYW1lKHZhbHVlLnJlZmVyZW5jZWRUb2tlbiwgYWxsR3JvdXBzKSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICAvLyBSYXcgdmFsdWVcbiAgICAgICAgcmVzdWx0ID0ge1xuICAgICAgICAgICAgcmFkaXVzOiB7XG4gICAgICAgICAgICAgICAgdHlwZTogXCJtZWFzdXJlXCIsXG4gICAgICAgICAgICAgICAgdmFsdWU6IHJlcHJlc2VudE1lYXN1cmVUb2tlblZhbHVlKHZhbHVlLnJhZGl1cywgYWxsVG9rZW5zLCBhbGxHcm91cHMpLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHRvcExlZnQ6IHZhbHVlLnRvcExlZnRcbiAgICAgICAgICAgICAgICA/IHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJtZWFzdXJlXCIsXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiByZXByZXNlbnRNZWFzdXJlVG9rZW5WYWx1ZSh2YWx1ZS50b3BMZWZ0LCBhbGxUb2tlbnMsIGFsbEdyb3VwcyksXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgdG9wUmlnaHQ6IHZhbHVlLnRvcFJpZ2h0XG4gICAgICAgICAgICAgICAgPyB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IFwibWVhc3VyZVwiLFxuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogcmVwcmVzZW50TWVhc3VyZVRva2VuVmFsdWUodmFsdWUudG9wUmlnaHQsIGFsbFRva2VucywgYWxsR3JvdXBzKSxcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgOiB1bmRlZmluZWQsXG4gICAgICAgICAgICBib3R0b21MZWZ0OiB2YWx1ZS5ib3R0b21MZWZ0XG4gICAgICAgICAgICAgICAgPyB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IFwibWVhc3VyZVwiLFxuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogcmVwcmVzZW50TWVhc3VyZVRva2VuVmFsdWUodmFsdWUuYm90dG9tTGVmdCwgYWxsVG9rZW5zLCBhbGxHcm91cHMpLFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICA6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgIGJvdHRvbVJpZ2h0OiB2YWx1ZS5ib3R0b21SaWdodFxuICAgICAgICAgICAgICAgID8ge1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiBcIm1lYXN1cmVcIixcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHJlcHJlc2VudE1lYXN1cmVUb2tlblZhbHVlKHZhbHVlLmJvdHRvbVJpZ2h0LCBhbGxUb2tlbnMsIGFsbEdyb3VwcyksXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIDogdW5kZWZpbmVkLFxuICAgICAgICB9O1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xufVxuLyoqIFJlcHJlc2VudCBtZWFzdXJlIHRva2VuIHZhbHVlIGVpdGhlciBhcyByZWZlcmVuY2Ugb3IgYXMgcGxhaW4gcmVwcmVzZW50YXRpb24gKi9cbmZ1bmN0aW9uIHJlcHJlc2VudE1lYXN1cmVUb2tlblZhbHVlKHZhbHVlLCBhbGxUb2tlbnMsIGFsbEdyb3Vwcykge1xuICAgIGxldCByZXN1bHQ7XG4gICAgaWYgKHZhbHVlLnJlZmVyZW5jZWRUb2tlbikge1xuICAgICAgICAvLyBGb3JtcyByZWZlcmVuY2VcbiAgICAgICAgcmVzdWx0ID0gcmVmZXJlbmNlV3JhcHBlcihyZWZlcmVuY2VOYW1lKHZhbHVlLnJlZmVyZW5jZWRUb2tlbiwgYWxsR3JvdXBzKSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICAvLyBSYXcgdmFsdWVcbiAgICAgICAgcmVzdWx0ID0ge1xuICAgICAgICAgICAgbWVhc3VyZToge1xuICAgICAgICAgICAgICAgIHR5cGU6IFwic2l6ZVwiLFxuICAgICAgICAgICAgICAgIHZhbHVlOiB2YWx1ZS5tZWFzdXJlLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHVuaXQ6IHtcbiAgICAgICAgICAgICAgICB0eXBlOiBcInN0cmluZ1wiLFxuICAgICAgICAgICAgICAgIHZhbHVlOiB2YWx1ZS51bml0LnRvTG93ZXJDYXNlKCksXG4gICAgICAgICAgICB9LFxuICAgICAgICB9O1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xufVxuLyoqIFJlcHJlc2VudCBmb250IHRva2VuIHZhbHVlIGVpdGhlciBhcyByZWZlcmVuY2Ugb3IgYXMgcGxhaW4gcmVwcmVzZW50YXRpb24gKi9cbmZ1bmN0aW9uIHJlcHJlc2VudEZvbnRUb2tlblZhbHVlKHZhbHVlLCBhbGxUb2tlbnMsIGFsbEdyb3Vwcykge1xuICAgIGxldCByZXN1bHQ7XG4gICAgaWYgKHZhbHVlLnJlZmVyZW5jZWRUb2tlbikge1xuICAgICAgICAvLyBGb3JtcyByZWZlcmVuY2VcbiAgICAgICAgcmVzdWx0ID0gcmVmZXJlbmNlV3JhcHBlcihyZWZlcmVuY2VOYW1lKHZhbHVlLnJlZmVyZW5jZWRUb2tlbiwgYWxsR3JvdXBzKSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICAvLyBSYXcgdmFsdWVcbiAgICAgICAgcmVzdWx0ID0ge1xuICAgICAgICAgICAgZmFtaWx5OiB7XG4gICAgICAgICAgICAgICAgdHlwZTogXCJzdHJpbmdcIixcbiAgICAgICAgICAgICAgICB2YWx1ZTogdmFsdWUuZmFtaWx5LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHN1YmZhbWlseToge1xuICAgICAgICAgICAgICAgIHR5cGU6IFwic3RyaW5nXCIsXG4gICAgICAgICAgICAgICAgdmFsdWU6IHZhbHVlLnN1YmZhbWlseSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH07XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG59XG4vKiogUmVwcmVzZW50IHRleHQgdG9rZW4gdmFsdWUgZWl0aGVyIGFzIHJlZmVyZW5jZSBvciBhcyBwbGFpbiByZXByZXNlbnRhdGlvbiAqL1xuZnVuY3Rpb24gcmVwcmVzZW50VGV4dFRva2VuVmFsdWUodmFsdWUsIGFsbFRva2VucywgYWxsR3JvdXBzKSB7XG4gICAgbGV0IHJlc3VsdDtcbiAgICBpZiAodmFsdWUucmVmZXJlbmNlZFRva2VuKSB7XG4gICAgICAgIC8vIEZvcm1zIHJlZmVyZW5jZVxuICAgICAgICByZXN1bHQgPSByZWZlcmVuY2VXcmFwcGVyKHJlZmVyZW5jZU5hbWUodmFsdWUucmVmZXJlbmNlZFRva2VuLCBhbGxHcm91cHMpKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIC8vIFJhdyB2YWx1ZVxuICAgICAgICByZXN1bHQgPSB2YWx1ZS50ZXh0O1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xufVxuLyoqIFJlcHJlc2VudCB0eXBvZ3JhcGh5IHRva2VuIHZhbHVlIGVpdGhlciBhcyByZWZlcmVuY2Ugb3IgYXMgcGxhaW4gcmVwcmVzZW50YXRpb24gKi9cbmZ1bmN0aW9uIHJlcHJlc2VudFR5cG9ncmFwaHlUb2tlblZhbHVlKHZhbHVlLCBhbGxUb2tlbnMsIGFsbEdyb3Vwcykge1xuICAgIGxldCByZXN1bHQ7XG4gICAgaWYgKHZhbHVlLnJlZmVyZW5jZWRUb2tlbikge1xuICAgICAgICAvLyBGb3JtcyByZWZlcmVuY2VcbiAgICAgICAgcmVzdWx0ID0gcmVmZXJlbmNlV3JhcHBlcihyZWZlcmVuY2VOYW1lKHZhbHVlLnJlZmVyZW5jZWRUb2tlbiwgYWxsR3JvdXBzKSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICAvLyBSYXcgdmFsdWVcbiAgICAgICAgcmVzdWx0ID0ge1xuICAgICAgICAgICAgZm9udDoge1xuICAgICAgICAgICAgICAgIHR5cGU6IFwiZm9udFwiLFxuICAgICAgICAgICAgICAgIHZhbHVlOiByZXByZXNlbnRGb250VG9rZW5WYWx1ZSh2YWx1ZS5mb250LCBhbGxUb2tlbnMsIGFsbEdyb3VwcyksXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZm9udFNpemU6IHtcbiAgICAgICAgICAgICAgICB0eXBlOiBcIm1lYXN1cmVcIixcbiAgICAgICAgICAgICAgICB2YWx1ZTogcmVwcmVzZW50TWVhc3VyZVRva2VuVmFsdWUodmFsdWUuZm9udFNpemUsIGFsbFRva2VucywgYWxsR3JvdXBzKSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB0ZXh0RGVjb3JhdGlvbjogdmFsdWUudGV4dERlY29yYXRpb24sXG4gICAgICAgICAgICB0ZXh0Q2FzZTogdmFsdWUudGV4dENhc2UsXG4gICAgICAgICAgICBsZXR0ZXJTcGFjaW5nOiB7XG4gICAgICAgICAgICAgICAgdHlwZTogXCJtZWFzdXJlXCIsXG4gICAgICAgICAgICAgICAgdmFsdWU6IHJlcHJlc2VudE1lYXN1cmVUb2tlblZhbHVlKHZhbHVlLmxldHRlclNwYWNpbmcsIGFsbFRva2VucywgYWxsR3JvdXBzKSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBwYXJhZ3JhcGhJbmRlbnQ6IHtcbiAgICAgICAgICAgICAgICB0eXBlOiBcIm1lYXN1cmVcIixcbiAgICAgICAgICAgICAgICB2YWx1ZTogcmVwcmVzZW50TWVhc3VyZVRva2VuVmFsdWUodmFsdWUucGFyYWdyYXBoSW5kZW50LCBhbGxUb2tlbnMsIGFsbEdyb3VwcyksXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbGluZUhlaWdodDogdmFsdWUubGluZUhlaWdodFxuICAgICAgICAgICAgICAgID8ge1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiBcIm1lYXN1cmVcIixcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHJlcHJlc2VudE1lYXN1cmVUb2tlblZhbHVlKHZhbHVlLmxpbmVIZWlnaHQsIGFsbFRva2VucywgYWxsR3JvdXBzKSxcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgOiB1bmRlZmluZWQsXG4gICAgICAgIH07XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG59XG4vKiogUmVwcmVzZW50IGJvcmRlciB0b2tlbiB2YWx1ZSBlaXRoZXIgYXMgcmVmZXJlbmNlIG9yIGFzIHBsYWluIHJlcHJlc2VudGF0aW9uICovXG5mdW5jdGlvbiByZXByZXNlbnRCb3JkZXJUb2tlblZhbHVlKHZhbHVlLCBhbGxUb2tlbnMsIGFsbEdyb3Vwcykge1xuICAgIGxldCByZXN1bHQ7XG4gICAgaWYgKHZhbHVlLnJlZmVyZW5jZWRUb2tlbikge1xuICAgICAgICAvLyBGb3JtcyByZWZlcmVuY2VcbiAgICAgICAgcmVzdWx0ID0gcmVmZXJlbmNlV3JhcHBlcihyZWZlcmVuY2VOYW1lKHZhbHVlLnJlZmVyZW5jZWRUb2tlbiwgYWxsR3JvdXBzKSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICAvLyBSYXcgdmFsdWVcbiAgICAgICAgcmVzdWx0ID0ge1xuICAgICAgICAgICAgY29sb3I6IHtcbiAgICAgICAgICAgICAgICB0eXBlOiBcImNvbG9yXCIsXG4gICAgICAgICAgICAgICAgdmFsdWU6IHJlcHJlc2VudENvbG9yVG9rZW5WYWx1ZSh2YWx1ZS5jb2xvciwgYWxsVG9rZW5zLCBhbGxHcm91cHMpLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHdpZHRoOiB7XG4gICAgICAgICAgICAgICAgdHlwZTogXCJtZWFzdXJlXCIsXG4gICAgICAgICAgICAgICAgdmFsdWU6IHJlcHJlc2VudE1lYXN1cmVUb2tlblZhbHVlKHZhbHVlLndpZHRoLCBhbGxUb2tlbnMsIGFsbEdyb3VwcyksXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcG9zaXRpb246IHtcbiAgICAgICAgICAgICAgICB0eXBlOiBcInN0cmluZ1wiLFxuICAgICAgICAgICAgICAgIHZhbHVlOiB2YWx1ZS5wb3NpdGlvbixcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH07XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG59XG4vKiogUmVwcmVzZW50IHNoYWRvdyB0b2tlbiB2YWx1ZSBlaXRoZXIgYXMgcmVmZXJlbmNlIG9yIGFzIHBsYWluIHJlcHJlc2VudGF0aW9uICovXG5mdW5jdGlvbiByZXByZXNlbnRTaGFkb3dUb2tlblZhbHVlKHZhbHVlLCBhbGxUb2tlbnMsIGFsbEdyb3Vwcykge1xuICAgIGxldCByZXN1bHQ7XG4gICAgaWYgKHZhbHVlLnJlZmVyZW5jZWRUb2tlbikge1xuICAgICAgICAvLyBGb3JtcyByZWZlcmVuY2VcbiAgICAgICAgcmVzdWx0ID0gcmVmZXJlbmNlV3JhcHBlcihyZWZlcmVuY2VOYW1lKHZhbHVlLnJlZmVyZW5jZWRUb2tlbiwgYWxsR3JvdXBzKSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICAvLyBSYXcgdmFsdWVcbiAgICAgICAgcmVzdWx0ID0ge1xuICAgICAgICAgICAgY29sb3I6IHtcbiAgICAgICAgICAgICAgICB0eXBlOiBcImNvbG9yXCIsXG4gICAgICAgICAgICAgICAgdmFsdWU6IHJlcHJlc2VudENvbG9yVG9rZW5WYWx1ZSh2YWx1ZS5jb2xvciwgYWxsVG9rZW5zLCBhbGxHcm91cHMpLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHg6IHtcbiAgICAgICAgICAgICAgICB0eXBlOiBcIm1lYXN1cmVcIixcbiAgICAgICAgICAgICAgICB2YWx1ZTogcmVwcmVzZW50TWVhc3VyZVRva2VuVmFsdWUodmFsdWUueCwgYWxsVG9rZW5zLCBhbGxHcm91cHMpLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHk6IHtcbiAgICAgICAgICAgICAgICB0eXBlOiBcIm1lYXN1cmVcIixcbiAgICAgICAgICAgICAgICB2YWx1ZTogcmVwcmVzZW50TWVhc3VyZVRva2VuVmFsdWUodmFsdWUueSwgYWxsVG9rZW5zLCBhbGxHcm91cHMpLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHJhZGl1czoge1xuICAgICAgICAgICAgICAgIHR5cGU6IFwibWVhc3VyZVwiLFxuICAgICAgICAgICAgICAgIHZhbHVlOiByZXByZXNlbnRNZWFzdXJlVG9rZW5WYWx1ZSh2YWx1ZS5yYWRpdXMsIGFsbFRva2VucywgYWxsR3JvdXBzKSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzcHJlYWQ6IHtcbiAgICAgICAgICAgICAgICB0eXBlOiBcIm1lYXN1cmVcIixcbiAgICAgICAgICAgICAgICB2YWx1ZTogcmVwcmVzZW50TWVhc3VyZVRva2VuVmFsdWUodmFsdWUuc3ByZWFkLCBhbGxUb2tlbnMsIGFsbEdyb3VwcyksXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgb3BhY2l0eToge1xuICAgICAgICAgICAgICAgIHR5cGU6IFwic2l6ZVwiLFxuICAgICAgICAgICAgICAgIHZhbHVlOiB2YWx1ZS5vcGFjaXR5LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgfTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbn1cbi8qKiBSZXByZXNlbnQgZ3JhZGllbnQgdG9rZW4gdmFsdWUgZWl0aGVyIGFzIHJlZmVyZW5jZSBvciBhcyBwbGFpbiByZXByZXNlbnRhdGlvbiAqL1xuZnVuY3Rpb24gcmVwcmVzZW50R3JhZGllbnRUb2tlblZhbHVlKHZhbHVlLCBhbGxUb2tlbnMsIGFsbEdyb3Vwcykge1xuICAgIGxldCByZXN1bHQ7XG4gICAgaWYgKHZhbHVlLnJlZmVyZW5jZWRUb2tlbikge1xuICAgICAgICAvLyBGb3JtcyByZWZlcmVuY2VcbiAgICAgICAgcmVzdWx0ID0gcmVmZXJlbmNlV3JhcHBlcihyZWZlcmVuY2VOYW1lKHZhbHVlLnJlZmVyZW5jZWRUb2tlbiwgYWxsR3JvdXBzKSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICAvLyBSYXcgdmFsdWVcbiAgICAgICAgcmVzdWx0ID0ge1xuICAgICAgICAgICAgdG86IHtcbiAgICAgICAgICAgICAgICB0eXBlOiBcInBvaW50XCIsXG4gICAgICAgICAgICAgICAgdmFsdWU6IHtcbiAgICAgICAgICAgICAgICAgICAgeDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJzaXplXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogdmFsdWUudG8ueCxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgeToge1xuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJzaXplXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogdmFsdWUudG8ueSxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGZyb206IHtcbiAgICAgICAgICAgICAgICB0eXBlOiBcInBvaW50XCIsXG4gICAgICAgICAgICAgICAgdmFsdWU6IHtcbiAgICAgICAgICAgICAgICAgICAgeDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJzaXplXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogdmFsdWUuZnJvbS54LFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB5OiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBcInNpemVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiB2YWx1ZS5mcm9tLnksXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB0eXBlOiB7XG4gICAgICAgICAgICAgICAgdHlwZTogXCJzdHJpbmdcIixcbiAgICAgICAgICAgICAgICB2YWx1ZTogdmFsdWUudHlwZSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBhc3BlY3RSYXRpbzoge1xuICAgICAgICAgICAgICAgIHR5cGU6IFwic2l6ZVwiLFxuICAgICAgICAgICAgICAgIHZhbHVlOiB2YWx1ZS5hc3BlY3RSYXRpbyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzdG9wczoge30sXG4gICAgICAgIH07XG4gICAgICAgIC8vIEluamVjdCBncmFkaWVudCBzdG9wc1xuICAgICAgICBsZXQgY291bnQgPSAwO1xuICAgICAgICBmb3IgKGxldCBzdG9wIG9mIHZhbHVlLnN0b3BzKSB7XG4gICAgICAgICAgICBsZXQgc3RvcE9iamVjdCA9IHtcbiAgICAgICAgICAgICAgICB0eXBlOiBcImdyYWRpZW50U3RvcFwiLFxuICAgICAgICAgICAgICAgIHBvc2l0aW9uOiB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IFwic2l6ZVwiLFxuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogc3RvcC5wb3NpdGlvbixcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGNvbG9yOiB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IFwiY29sb3JcIixcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHJlcHJlc2VudENvbG9yVG9rZW5WYWx1ZShzdG9wLmNvbG9yLCBhbGxUb2tlbnMsIGFsbEdyb3VwcyksXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICByZXN1bHQuc3RvcHNbYCR7Y291bnR9YF0gPSBzdG9wT2JqZWN0O1xuICAgICAgICAgICAgY291bnQrKztcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xufVxuLy8gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLVxuLy8gTUFSSzogLSBPYmplY3Qgd3JhcHBlcnNcbi8qKiBSZXRyaWV2ZSB3cmFwcGVyIHRvIGNlcnRhaW4gdG9rZW4gKHJlZmVyZW5jZWQgYnkgbmFtZSkgcG9pbnRpbmcgdG8gdG9rZW4gdmFsdWUgKi9cbmZ1bmN0aW9uIHJlZmVyZW5jZVdyYXBwZXIocmVmZXJlbmNlKSB7XG4gICAgcmV0dXJuIGB7JHtyZWZlcmVuY2V9LnZhbHVlfWA7XG59XG4vKiogUmV0cmlldmUgdG9rZW4gd3JhcHBlciBjb250YWluaW5nIGl0cyBtZXRhZGF0YSBhbmQgdmFsdWUgaW5mb3JtYXRpb24gKHVzZWQgYXMgY29udGFpbmVyIGZvciBlYWNoIGRlZmluZWQgdG9rZW4pICovXG5mdW5jdGlvbiB0b2tlbldyYXBwZXIodG9rZW4sIHZhbHVlKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgICB0eXBlOiB0eXBlTGFiZWwodG9rZW4udG9rZW5UeXBlKSxcbiAgICAgICAgY29tbWVudDogdG9rZW4uZGVzY3JpcHRpb24ubGVuZ3RoID4gMCA/IHRva2VuLmRlc2NyaXB0aW9uIDogdW5kZWZpbmVkLFxuICAgIH07XG59XG4vLyAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tXG4vLyBNQVJLOiAtIE5hbWluZ1xuLyoqIENyZWF0ZSBmdWxsIHJlZmVyZW5jZSBuYW1lIHJlcHJlc2VudGluZyB0b2tlbi4gU3VjaCBuYW1lIGNhbiwgZm9yIGV4YW1wbGUsIGxvb2sgbGlrZTogW2cxXS5bZzJdLltnM10uW2c0XS5bdG9rZW4tbmFtZV0gKi9cbmZ1bmN0aW9uIHJlZmVyZW5jZU5hbWUodG9rZW4sIGFsbEdyb3Vwcykge1xuICAgIC8vIEZpbmQgdGhlIGdyb3VwIHRvIHdoaWNoIHRva2VuIGJlbG9uZ3MuIFRoaXMgaXMgcmVhbGx5IHN1Ym9wdGltYWwgYW5kIHNob3VsZCBiZSBzb2x2ZWQgYnkgdGhlIFNESyB0byBqdXN0IHByb3ZpZGUgdGhlIGdyb3VwIHJlZmVyZW5jZVxuICAgIGxldCBvY2N1cmFuY2VzID0gYWxsR3JvdXBzLmZpbHRlcigoZykgPT4gZy50b2tlbklkcy5pbmRleE9mKHRva2VuLmlkKSAhPT0gLTEpO1xuICAgIGlmIChvY2N1cmFuY2VzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICB0aHJvdyBFcnJvcihcIkpTOiBVbmFibGUgdG8gZmluZCB0b2tlbiBpbiBhbnkgb2YgdGhlIGdyb3Vwc1wiKTtcbiAgICB9XG4gICAgbGV0IGNvbnRhaW5pbmdHcm91cCA9IG9jY3VyYW5jZXNbMF07XG4gICAgbGV0IHRva2VuUGFydCA9IHNhZmVUb2tlbk5hbWUodG9rZW4pO1xuICAgIGxldCBncm91cFBhcnRzID0gcmVmZXJlbmNlR3JvdXBDaGFpbihjb250YWluaW5nR3JvdXApLm1hcCgoZykgPT4gc2FmZUdyb3VwTmFtZShnKSk7XG4gICAgcmV0dXJuIFsuLi5ncm91cFBhcnRzLCB0b2tlblBhcnRdLmpvaW4oXCIuXCIpO1xufVxuLyoqIFJldHJpZXZlIHNhZmUgdG9rZW4gbmFtZSBtYWRlIG91dCBvZiBub3JtYWwgdG9rZW4gbmFtZVxuICogVGhpcyByZXBsYWNlIHNwYWNlcyB3aXRoIGRhc2hlcywgYWxzbyBjaGFuZ2UgYW55dGhpbmcgbm9uLWFscGhhbnVtZXJpYyBjaGFyIHRvIGl0IGFzIHdlbGwuXG4gKiBGb3IgZXhhbXBsZSwgU1QmUksgSW5kdXN0cmllcyB3aWxsIGJlIGNoYW5nZWQgdG8gc3QtcmstaW5kdXN0cmllc1xuICovXG5mdW5jdGlvbiBzYWZlVG9rZW5OYW1lKHRva2VuKSB7XG4gICAgcmV0dXJuIHRva2VuLm5hbWUucmVwbGFjZSgvXFxXKy9nLCBcIi1cIikudG9Mb3dlckNhc2UoKTtcbn1cbi8qKiBSZXRyaWV2ZSBzYWZlIGdyb3VwIG5hbWUgbWFkZSBvdXQgb2Ygbm9ybWFsIGdyb3VwIG5hbWVcbiAqIFRoaXMgcmVwbGFjZSBzcGFjZXMgd2l0aCBkYXNoZXMsIGFsc28gY2hhbmdlIGFueXRoaW5nIG5vbi1hbHBoYW51bWVyaWMgY2hhciB0byBpdCBhcyB3ZWxsLlxuICogRm9yIGV4YW1wbGUsIFNUJlJLIEluZHVzdHJpZXMgd2lsbCBiZSBjaGFuZ2VkIHRvIHN0LXJrLWluZHVzdHJpZXNcbiAqL1xuZnVuY3Rpb24gc2FmZUdyb3VwTmFtZShncm91cCkge1xuICAgIHJldHVybiBncm91cC5uYW1lLnJlcGxhY2UoL1xcVysvZywgXCItXCIpLnRvTG93ZXJDYXNlKCk7XG59XG4vKiogUmV0cmlldmUgaHVtYW4tcmVhZGFibGUgdG9rZW4gdHlwZSBpbiB1bmlmaWVkIGZhc2hpb24sIHVzZWQgYm90aCBhcyB0b2tlbiB0eXBlIGFuZCBhcyB0b2tlbiBtYXN0ZXIgZ3JvdXAgKi9cbmZ1bmN0aW9uIHR5cGVMYWJlbCh0eXBlKSB7XG4gICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICAgIGNhc2UgXCJCb3JkZXJcIjpcbiAgICAgICAgICAgIHJldHVybiBcImJvcmRlclwiO1xuICAgICAgICBjYXNlIFwiQ29sb3JcIjpcbiAgICAgICAgICAgIHJldHVybiBcImNvbG9yXCI7XG4gICAgICAgIGNhc2UgXCJGb250XCI6XG4gICAgICAgICAgICByZXR1cm4gXCJmb250XCI7XG4gICAgICAgIGNhc2UgXCJHcmFkaWVudFwiOlxuICAgICAgICAgICAgcmV0dXJuIFwiZ3JhZGllbnRcIjtcbiAgICAgICAgY2FzZSBcIk1lYXN1cmVcIjpcbiAgICAgICAgICAgIHJldHVybiBcIm1lYXN1cmVcIjtcbiAgICAgICAgY2FzZSBcIlJhZGl1c1wiOlxuICAgICAgICAgICAgcmV0dXJuIFwicmFkaXVzXCI7XG4gICAgICAgIGNhc2UgXCJTaGFkb3dcIjpcbiAgICAgICAgICAgIHJldHVybiBcInNoYWRvd1wiO1xuICAgICAgICBjYXNlIFwiVGV4dFwiOlxuICAgICAgICAgICAgcmV0dXJuIFwidGV4dFwiO1xuICAgICAgICBjYXNlIFwiVHlwb2dyYXBoeVwiOlxuICAgICAgICAgICAgcmV0dXJuIFwidHlwb2dyYXBoeVwiO1xuICAgIH1cbn1cbi8vIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS0gLS0tIC0tLSAtLS1cbi8vIE1BUks6IC0gTG9va3VwXG4vKiogRmluZCBhbGwgdG9rZW5zIHRoYXQgYmVsb25nIHRvIGEgY2VydGFpbiBncm91cCBhbmQgcmV0cmlldmUgdGhlbSBhcyBvYmplY3RzICovXG5mdW5jdGlvbiB0b2tlbnNPZkdyb3VwKGNvbnRhaW5pbmdHcm91cCwgYWxsVG9rZW5zKSB7XG4gICAgcmV0dXJuIGFsbFRva2Vucy5maWx0ZXIoKHQpID0+IGNvbnRhaW5pbmdHcm91cC50b2tlbklkcy5pbmRleE9mKHQuaWQpICE9PSAtMSk7XG59XG4vKiogUmV0cmlldmUgY2hhaW4gb2YgZ3JvdXBzIHVwIHRvIGEgc3BlY2lmaWVkIGdyb3VwLCBvcmRlcmVkIGZyb20gcGFyZW50IHRvIGNoaWxkcmVuICovXG5mdW5jdGlvbiByZWZlcmVuY2VHcm91cENoYWluKGNvbnRhaW5pbmdHcm91cCkge1xuICAgIGxldCBpdGVyYXRlZEdyb3VwID0gY29udGFpbmluZ0dyb3VwO1xuICAgIGxldCBjaGFpbiA9IFtjb250YWluaW5nR3JvdXBdO1xuICAgIHdoaWxlIChpdGVyYXRlZEdyb3VwLnBhcmVudCkge1xuICAgICAgICBjaGFpbi5wdXNoKGl0ZXJhdGVkR3JvdXAucGFyZW50KTtcbiAgICAgICAgaXRlcmF0ZWRHcm91cCA9IGl0ZXJhdGVkR3JvdXAucGFyZW50O1xuICAgIH1cbiAgICByZXR1cm4gY2hhaW4ucmV2ZXJzZSgpO1xufVxuIl0sInNvdXJjZVJvb3QiOiIifQ==