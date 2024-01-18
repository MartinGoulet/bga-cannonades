var BgaAnimation = (function () {
    function BgaAnimation(animationFunction, settings) {
        this.animationFunction = animationFunction;
        this.settings = settings;
        this.played = null;
        this.result = null;
        this.playWhenNoAnimation = false;
    }
    return BgaAnimation;
}());
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
function attachWithAnimation(animationManager, animation) {
    var _a;
    var settings = animation.settings;
    var element = settings.animation.settings.element;
    var fromRect = element.getBoundingClientRect();
    settings.animation.settings.fromRect = fromRect;
    settings.attachElement.appendChild(element);
    (_a = settings.afterAttach) === null || _a === void 0 ? void 0 : _a.call(settings, element, settings.attachElement);
    return animationManager.play(settings.animation);
}
var BgaAttachWithAnimation = (function (_super) {
    __extends(BgaAttachWithAnimation, _super);
    function BgaAttachWithAnimation(settings) {
        var _this = _super.call(this, attachWithAnimation, settings) || this;
        _this.playWhenNoAnimation = true;
        return _this;
    }
    return BgaAttachWithAnimation;
}(BgaAnimation));
function cumulatedAnimations(animationManager, animation) {
    return animationManager.playSequence(animation.settings.animations);
}
var BgaCumulatedAnimation = (function (_super) {
    __extends(BgaCumulatedAnimation, _super);
    function BgaCumulatedAnimation(settings) {
        var _this = _super.call(this, cumulatedAnimations, settings) || this;
        _this.playWhenNoAnimation = true;
        return _this;
    }
    return BgaCumulatedAnimation;
}(BgaAnimation));
function slideToAnimation(animationManager, animation) {
    var promise = new Promise(function (success) {
        var _a, _b, _c, _d, _e;
        var settings = animation.settings;
        var element = settings.element;
        var _f = getDeltaCoordinates(element, settings), x = _f.x, y = _f.y;
        var duration = (_a = settings === null || settings === void 0 ? void 0 : settings.duration) !== null && _a !== void 0 ? _a : 500;
        var originalZIndex = element.style.zIndex;
        var originalTransition = element.style.transition;
        var transitionTimingFunction = (_b = settings.transitionTimingFunction) !== null && _b !== void 0 ? _b : 'linear';
        element.style.zIndex = "".concat((_c = settings === null || settings === void 0 ? void 0 : settings.zIndex) !== null && _c !== void 0 ? _c : 10);
        var timeoutId = null;
        var cleanOnTransitionEnd = function () {
            element.style.zIndex = originalZIndex;
            element.style.transition = originalTransition;
            success();
            element.removeEventListener('transitioncancel', cleanOnTransitionEnd);
            element.removeEventListener('transitionend', cleanOnTransitionEnd);
            document.removeEventListener('visibilitychange', cleanOnTransitionEnd);
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
        var cleanOnTransitionCancel = function () {
            var _a;
            element.style.transition = "";
            element.offsetHeight;
            element.style.transform = (_a = settings === null || settings === void 0 ? void 0 : settings.finalTransform) !== null && _a !== void 0 ? _a : null;
            element.offsetHeight;
            cleanOnTransitionEnd();
        };
        element.addEventListener('transitioncancel', cleanOnTransitionEnd);
        element.addEventListener('transitionend', cleanOnTransitionEnd);
        document.addEventListener('visibilitychange', cleanOnTransitionCancel);
        element.offsetHeight;
        element.style.transition = "transform ".concat(duration, "ms ").concat(transitionTimingFunction);
        element.offsetHeight;
        element.style.transform = "translate(".concat(-x, "px, ").concat(-y, "px) rotate(").concat((_d = settings === null || settings === void 0 ? void 0 : settings.rotationDelta) !== null && _d !== void 0 ? _d : 0, "deg) scale(").concat((_e = settings.scale) !== null && _e !== void 0 ? _e : 1, ")");
        timeoutId = setTimeout(cleanOnTransitionEnd, duration + 100);
    });
    return promise;
}
var BgaSlideToAnimation = (function (_super) {
    __extends(BgaSlideToAnimation, _super);
    function BgaSlideToAnimation(settings) {
        return _super.call(this, slideToAnimation, settings) || this;
    }
    return BgaSlideToAnimation;
}(BgaAnimation));
function slideAnimation(animationManager, animation) {
    var promise = new Promise(function (success) {
        var _a, _b, _c, _d, _e;
        var settings = animation.settings;
        var element = settings.element;
        var _f = getDeltaCoordinates(element, settings), x = _f.x, y = _f.y;
        var duration = (_a = settings.duration) !== null && _a !== void 0 ? _a : 500;
        var originalZIndex = element.style.zIndex;
        var originalTransition = element.style.transition;
        var transitionTimingFunction = (_b = settings.transitionTimingFunction) !== null && _b !== void 0 ? _b : 'linear';
        element.style.zIndex = "".concat((_c = settings === null || settings === void 0 ? void 0 : settings.zIndex) !== null && _c !== void 0 ? _c : 10);
        element.style.transition = null;
        element.offsetHeight;
        element.style.transform = "translate(".concat(-x, "px, ").concat(-y, "px) rotate(").concat((_d = settings === null || settings === void 0 ? void 0 : settings.rotationDelta) !== null && _d !== void 0 ? _d : 0, "deg)");
        var timeoutId = null;
        var cleanOnTransitionEnd = function () {
            element.style.zIndex = originalZIndex;
            element.style.transition = originalTransition;
            success();
            element.removeEventListener('transitioncancel', cleanOnTransitionEnd);
            element.removeEventListener('transitionend', cleanOnTransitionEnd);
            document.removeEventListener('visibilitychange', cleanOnTransitionEnd);
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
        var cleanOnTransitionCancel = function () {
            var _a;
            element.style.transition = "";
            element.offsetHeight;
            element.style.transform = (_a = settings === null || settings === void 0 ? void 0 : settings.finalTransform) !== null && _a !== void 0 ? _a : null;
            element.offsetHeight;
            cleanOnTransitionEnd();
        };
        element.addEventListener('transitioncancel', cleanOnTransitionCancel);
        element.addEventListener('transitionend', cleanOnTransitionEnd);
        document.addEventListener('visibilitychange', cleanOnTransitionCancel);
        element.offsetHeight;
        element.style.transition = "transform ".concat(duration, "ms ").concat(transitionTimingFunction);
        element.offsetHeight;
        element.style.transform = (_e = settings === null || settings === void 0 ? void 0 : settings.finalTransform) !== null && _e !== void 0 ? _e : null;
        timeoutId = setTimeout(cleanOnTransitionEnd, duration + 100);
    });
    return promise;
}
var BgaSlideAnimation = (function (_super) {
    __extends(BgaSlideAnimation, _super);
    function BgaSlideAnimation(settings) {
        return _super.call(this, slideAnimation, settings) || this;
    }
    return BgaSlideAnimation;
}(BgaAnimation));
function shouldAnimate(settings) {
    var _a;
    return document.visibilityState !== 'hidden' && !((_a = settings === null || settings === void 0 ? void 0 : settings.game) === null || _a === void 0 ? void 0 : _a.instantaneousMode);
}
function getDeltaCoordinates(element, settings) {
    var _a;
    if (!settings.fromDelta && !settings.fromRect && !settings.fromElement) {
        throw new Error("[bga-animation] fromDelta, fromRect or fromElement need to be set");
    }
    var x = 0;
    var y = 0;
    if (settings.fromDelta) {
        x = settings.fromDelta.x;
        y = settings.fromDelta.y;
    }
    else {
        var originBR = (_a = settings.fromRect) !== null && _a !== void 0 ? _a : settings.fromElement.getBoundingClientRect();
        var originalTransform = element.style.transform;
        element.style.transform = '';
        var destinationBR = element.getBoundingClientRect();
        element.style.transform = originalTransform;
        x = (destinationBR.left + destinationBR.right) / 2 - (originBR.left + originBR.right) / 2;
        y = (destinationBR.top + destinationBR.bottom) / 2 - (originBR.top + originBR.bottom) / 2;
    }
    if (settings.scale) {
        x /= settings.scale;
        y /= settings.scale;
    }
    return { x: x, y: y };
}
function logAnimation(animationManager, animation) {
    var settings = animation.settings;
    var element = settings.element;
    if (element) {
        console.log(animation, settings, element, element.getBoundingClientRect(), element.style.transform);
    }
    else {
        console.log(animation, settings);
    }
    return Promise.resolve(false);
}
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var AnimationManager = (function () {
    function AnimationManager(game, settings) {
        this.game = game;
        this.settings = settings;
        this.zoomManager = settings === null || settings === void 0 ? void 0 : settings.zoomManager;
        if (!game) {
            throw new Error('You must set your game as the first parameter of AnimationManager');
        }
    }
    AnimationManager.prototype.getZoomManager = function () {
        return this.zoomManager;
    };
    AnimationManager.prototype.setZoomManager = function (zoomManager) {
        this.zoomManager = zoomManager;
    };
    AnimationManager.prototype.getSettings = function () {
        return this.settings;
    };
    AnimationManager.prototype.animationsActive = function () {
        return document.visibilityState !== 'hidden' && !this.game.instantaneousMode;
    };
    AnimationManager.prototype.play = function (animation) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
        return __awaiter(this, void 0, void 0, function () {
            var settings, _r;
            return __generator(this, function (_s) {
                switch (_s.label) {
                    case 0:
                        animation.played = animation.playWhenNoAnimation || this.animationsActive();
                        if (!animation.played) return [3, 2];
                        settings = animation.settings;
                        (_a = settings.animationStart) === null || _a === void 0 ? void 0 : _a.call(settings, animation);
                        (_b = settings.element) === null || _b === void 0 ? void 0 : _b.classList.add((_c = settings.animationClass) !== null && _c !== void 0 ? _c : 'bga-animations_animated');
                        animation.settings = __assign({ duration: (_g = (_e = (_d = animation.settings) === null || _d === void 0 ? void 0 : _d.duration) !== null && _e !== void 0 ? _e : (_f = this.settings) === null || _f === void 0 ? void 0 : _f.duration) !== null && _g !== void 0 ? _g : 500, scale: (_l = (_j = (_h = animation.settings) === null || _h === void 0 ? void 0 : _h.scale) !== null && _j !== void 0 ? _j : (_k = this.zoomManager) === null || _k === void 0 ? void 0 : _k.zoom) !== null && _l !== void 0 ? _l : undefined }, animation.settings);
                        _r = animation;
                        return [4, animation.animationFunction(this, animation)];
                    case 1:
                        _r.result = _s.sent();
                        (_o = (_m = animation.settings).animationEnd) === null || _o === void 0 ? void 0 : _o.call(_m, animation);
                        (_p = settings.element) === null || _p === void 0 ? void 0 : _p.classList.remove((_q = settings.animationClass) !== null && _q !== void 0 ? _q : 'bga-animations_animated');
                        return [3, 3];
                    case 2: return [2, Promise.resolve(animation)];
                    case 3: return [2];
                }
            });
        });
    };
    AnimationManager.prototype.playParallel = function (animations) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2, Promise.all(animations.map(function (animation) { return _this.play(animation); }))];
            });
        });
    };
    AnimationManager.prototype.playSequence = function (animations) {
        return __awaiter(this, void 0, void 0, function () {
            var result, others;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!animations.length) return [3, 3];
                        return [4, this.play(animations[0])];
                    case 1:
                        result = _a.sent();
                        return [4, this.playSequence(animations.slice(1))];
                    case 2:
                        others = _a.sent();
                        return [2, __spreadArray([result], others, true)];
                    case 3: return [2, Promise.resolve([])];
                }
            });
        });
    };
    AnimationManager.prototype.playWithDelay = function (animations, delay) {
        return __awaiter(this, void 0, void 0, function () {
            var promise;
            var _this = this;
            return __generator(this, function (_a) {
                promise = new Promise(function (success) {
                    var promises = [];
                    var _loop_1 = function (i) {
                        setTimeout(function () {
                            promises.push(_this.play(animations[i]));
                            if (i == animations.length - 1) {
                                Promise.all(promises).then(function (result) {
                                    success(result);
                                });
                            }
                        }, i * delay);
                    };
                    for (var i = 0; i < animations.length; i++) {
                        _loop_1(i);
                    }
                });
                return [2, promise];
            });
        });
    };
    AnimationManager.prototype.attachWithAnimation = function (animation, attachElement) {
        var attachWithAnimation = new BgaAttachWithAnimation({
            animation: animation,
            attachElement: attachElement
        });
        return this.play(attachWithAnimation);
    };
    return AnimationManager;
}());
var CardStock = (function () {
    function CardStock(manager, element, settings) {
        this.manager = manager;
        this.element = element;
        this.settings = settings;
        this.cards = [];
        this.selectedCards = [];
        this.selectionMode = 'none';
        manager.addStock(this);
        element === null || element === void 0 ? void 0 : element.classList.add('card-stock');
        this.bindClick();
        this.sort = settings === null || settings === void 0 ? void 0 : settings.sort;
    }
    CardStock.prototype.remove = function () {
        var _a;
        this.manager.removeStock(this);
        (_a = this.element) === null || _a === void 0 ? void 0 : _a.remove();
    };
    CardStock.prototype.getCards = function () {
        return this.cards.slice();
    };
    CardStock.prototype.isEmpty = function () {
        return !this.cards.length;
    };
    CardStock.prototype.getSelection = function () {
        return this.selectedCards.slice();
    };
    CardStock.prototype.isSelected = function (card) {
        var _this = this;
        return this.selectedCards.some(function (c) { return _this.manager.getId(c) == _this.manager.getId(card); });
    };
    CardStock.prototype.contains = function (card) {
        var _this = this;
        return this.cards.some(function (c) { return _this.manager.getId(c) == _this.manager.getId(card); });
    };
    CardStock.prototype.getCardElement = function (card) {
        return this.manager.getCardElement(card);
    };
    CardStock.prototype.canAddCard = function (card, settings) {
        return !this.contains(card);
    };
    CardStock.prototype.addCard = function (card, animation, settings) {
        var _this = this;
        var _a, _b, _c, _d;
        if (!this.canAddCard(card, settings)) {
            return Promise.resolve(false);
        }
        var promise;
        var originStock = this.manager.getCardStock(card);
        var index = this.getNewCardIndex(card);
        var settingsWithIndex = __assign({ index: index }, (settings !== null && settings !== void 0 ? settings : {}));
        var updateInformations = (_a = settingsWithIndex.updateInformations) !== null && _a !== void 0 ? _a : true;
        var needsCreation = true;
        if (originStock === null || originStock === void 0 ? void 0 : originStock.contains(card)) {
            var element = this.getCardElement(card);
            if (element) {
                promise = this.moveFromOtherStock(card, element, __assign(__assign({}, animation), { fromStock: originStock }), settingsWithIndex);
                needsCreation = false;
                if (!updateInformations) {
                    element.dataset.side = ((_b = settingsWithIndex === null || settingsWithIndex === void 0 ? void 0 : settingsWithIndex.visible) !== null && _b !== void 0 ? _b : this.manager.isCardVisible(card)) ? 'front' : 'back';
                }
            }
        }
        else if ((_c = animation === null || animation === void 0 ? void 0 : animation.fromStock) === null || _c === void 0 ? void 0 : _c.contains(card)) {
            var element = this.getCardElement(card);
            if (element) {
                promise = this.moveFromOtherStock(card, element, animation, settingsWithIndex);
                needsCreation = false;
            }
        }
        if (needsCreation) {
            var element = this.getCardElement(card);
            if (needsCreation && element) {
                console.warn("Card ".concat(this.manager.getId(card), " already exists, not re-created."));
            }
            var newElement = element !== null && element !== void 0 ? element : this.manager.createCardElement(card, ((_d = settingsWithIndex === null || settingsWithIndex === void 0 ? void 0 : settingsWithIndex.visible) !== null && _d !== void 0 ? _d : this.manager.isCardVisible(card)));
            promise = this.moveFromElement(card, newElement, animation, settingsWithIndex);
        }
        if (settingsWithIndex.index !== null && settingsWithIndex.index !== undefined) {
            this.cards.splice(index, 0, card);
        }
        else {
            this.cards.push(card);
        }
        if (updateInformations) {
            this.manager.updateCardInformations(card);
        }
        if (!promise) {
            console.warn("CardStock.addCard didn't return a Promise");
            promise = Promise.resolve(false);
        }
        if (this.selectionMode !== 'none') {
            promise.then(function () { var _a; return _this.setSelectableCard(card, (_a = settingsWithIndex.selectable) !== null && _a !== void 0 ? _a : true); });
        }
        return promise;
    };
    CardStock.prototype.getNewCardIndex = function (card) {
        if (this.sort) {
            var otherCards = this.getCards();
            for (var i = 0; i < otherCards.length; i++) {
                var otherCard = otherCards[i];
                if (this.sort(card, otherCard) < 0) {
                    return i;
                }
            }
            return otherCards.length;
        }
        else {
            return undefined;
        }
    };
    CardStock.prototype.addCardElementToParent = function (cardElement, settings) {
        var _a;
        var parent = (_a = settings === null || settings === void 0 ? void 0 : settings.forceToElement) !== null && _a !== void 0 ? _a : this.element;
        if ((settings === null || settings === void 0 ? void 0 : settings.index) === null || (settings === null || settings === void 0 ? void 0 : settings.index) === undefined || !parent.children.length || (settings === null || settings === void 0 ? void 0 : settings.index) >= parent.children.length) {
            parent.appendChild(cardElement);
        }
        else {
            parent.insertBefore(cardElement, parent.children[settings.index]);
        }
    };
    CardStock.prototype.moveFromOtherStock = function (card, cardElement, animation, settings) {
        var promise;
        var element = animation.fromStock.contains(card) ? this.manager.getCardElement(card) : animation.fromStock.element;
        var fromRect = element === null || element === void 0 ? void 0 : element.getBoundingClientRect();
        this.addCardElementToParent(cardElement, settings);
        this.removeSelectionClassesFromElement(cardElement);
        promise = fromRect ? this.animationFromElement(cardElement, fromRect, {
            originalSide: animation.originalSide,
            rotationDelta: animation.rotationDelta,
            animation: animation.animation,
        }) : Promise.resolve(false);
        if (animation.fromStock && animation.fromStock != this) {
            animation.fromStock.removeCard(card);
        }
        if (!promise) {
            console.warn("CardStock.moveFromOtherStock didn't return a Promise");
            promise = Promise.resolve(false);
        }
        return promise;
    };
    CardStock.prototype.moveFromElement = function (card, cardElement, animation, settings) {
        var promise;
        this.addCardElementToParent(cardElement, settings);
        if (animation) {
            if (animation.fromStock) {
                promise = this.animationFromElement(cardElement, animation.fromStock.element.getBoundingClientRect(), {
                    originalSide: animation.originalSide,
                    rotationDelta: animation.rotationDelta,
                    animation: animation.animation,
                });
                animation.fromStock.removeCard(card);
            }
            else if (animation.fromElement) {
                promise = this.animationFromElement(cardElement, animation.fromElement.getBoundingClientRect(), {
                    originalSide: animation.originalSide,
                    rotationDelta: animation.rotationDelta,
                    animation: animation.animation,
                });
            }
        }
        else {
            promise = Promise.resolve(false);
        }
        if (!promise) {
            console.warn("CardStock.moveFromElement didn't return a Promise");
            promise = Promise.resolve(false);
        }
        return promise;
    };
    CardStock.prototype.addCards = function (cards, animation, settings, shift) {
        if (shift === void 0) { shift = false; }
        return __awaiter(this, void 0, void 0, function () {
            var promises, result, others, _loop_2, i, results;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.manager.animationsActive()) {
                            shift = false;
                        }
                        promises = [];
                        if (!(shift === true)) return [3, 4];
                        if (!cards.length) return [3, 3];
                        return [4, this.addCard(cards[0], animation, settings)];
                    case 1:
                        result = _a.sent();
                        return [4, this.addCards(cards.slice(1), animation, settings, shift)];
                    case 2:
                        others = _a.sent();
                        return [2, result || others];
                    case 3: return [3, 5];
                    case 4:
                        if (typeof shift === 'number') {
                            _loop_2 = function (i) {
                                setTimeout(function () { return promises.push(_this.addCard(cards[i], animation, settings)); }, i * shift);
                            };
                            for (i = 0; i < cards.length; i++) {
                                _loop_2(i);
                            }
                        }
                        else {
                            promises = cards.map(function (card) { return _this.addCard(card, animation, settings); });
                        }
                        _a.label = 5;
                    case 5: return [4, Promise.all(promises)];
                    case 6:
                        results = _a.sent();
                        return [2, results.some(function (result) { return result; })];
                }
            });
        });
    };
    CardStock.prototype.removeCard = function (card, settings) {
        var promise;
        if (this.contains(card) && this.element.contains(this.getCardElement(card))) {
            promise = this.manager.removeCard(card, settings);
        }
        else {
            promise = Promise.resolve(false);
        }
        this.cardRemoved(card, settings);
        return promise;
    };
    CardStock.prototype.cardRemoved = function (card, settings) {
        var _this = this;
        var index = this.cards.findIndex(function (c) { return _this.manager.getId(c) == _this.manager.getId(card); });
        if (index !== -1) {
            this.cards.splice(index, 1);
        }
        if (this.selectedCards.find(function (c) { return _this.manager.getId(c) == _this.manager.getId(card); })) {
            this.unselectCard(card);
        }
    };
    CardStock.prototype.removeCards = function (cards, settings) {
        return __awaiter(this, void 0, void 0, function () {
            var promises, results;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        promises = cards.map(function (card) { return _this.removeCard(card, settings); });
                        return [4, Promise.all(promises)];
                    case 1:
                        results = _a.sent();
                        return [2, results.some(function (result) { return result; })];
                }
            });
        });
    };
    CardStock.prototype.removeAll = function (settings) {
        return __awaiter(this, void 0, void 0, function () {
            var cards;
            return __generator(this, function (_a) {
                cards = this.getCards();
                return [2, this.removeCards(cards, settings)];
            });
        });
    };
    CardStock.prototype.setSelectionMode = function (selectionMode, selectableCards) {
        var _this = this;
        if (selectionMode !== this.selectionMode) {
            this.unselectAll(true);
        }
        this.cards.forEach(function (card) { return _this.setSelectableCard(card, selectionMode != 'none'); });
        this.element.classList.toggle('bga-cards_selectable-stock', selectionMode != 'none');
        this.selectionMode = selectionMode;
        if (selectionMode === 'none') {
            this.getCards().forEach(function (card) { return _this.removeSelectionClasses(card); });
        }
        else {
            this.setSelectableCards(selectableCards !== null && selectableCards !== void 0 ? selectableCards : this.getCards());
        }
    };
    CardStock.prototype.setSelectableCard = function (card, selectable) {
        if (this.selectionMode === 'none') {
            return;
        }
        var element = this.getCardElement(card);
        var selectableCardsClass = this.getSelectableCardClass();
        var unselectableCardsClass = this.getUnselectableCardClass();
        if (selectableCardsClass) {
            element === null || element === void 0 ? void 0 : element.classList.toggle(selectableCardsClass, selectable);
        }
        if (unselectableCardsClass) {
            element === null || element === void 0 ? void 0 : element.classList.toggle(unselectableCardsClass, !selectable);
        }
        if (!selectable && this.isSelected(card)) {
            this.unselectCard(card, true);
        }
    };
    CardStock.prototype.setSelectableCards = function (selectableCards) {
        var _this = this;
        if (this.selectionMode === 'none') {
            return;
        }
        var selectableCardsIds = (selectableCards !== null && selectableCards !== void 0 ? selectableCards : this.getCards()).map(function (card) { return _this.manager.getId(card); });
        this.cards.forEach(function (card) {
            return _this.setSelectableCard(card, selectableCardsIds.includes(_this.manager.getId(card)));
        });
    };
    CardStock.prototype.selectCard = function (card, silent) {
        var _this = this;
        var _a;
        if (silent === void 0) { silent = false; }
        if (this.selectionMode == 'none') {
            return;
        }
        var element = this.getCardElement(card);
        var selectableCardsClass = this.getSelectableCardClass();
        if (!element || !element.classList.contains(selectableCardsClass)) {
            return;
        }
        if (this.selectionMode === 'single') {
            this.cards.filter(function (c) { return _this.manager.getId(c) != _this.manager.getId(card); }).forEach(function (c) { return _this.unselectCard(c, true); });
        }
        var selectedCardsClass = this.getSelectedCardClass();
        element.classList.add(selectedCardsClass);
        this.selectedCards.push(card);
        if (!silent) {
            (_a = this.onSelectionChange) === null || _a === void 0 ? void 0 : _a.call(this, this.selectedCards.slice(), card);
        }
    };
    CardStock.prototype.unselectCard = function (card, silent) {
        var _this = this;
        var _a;
        if (silent === void 0) { silent = false; }
        var element = this.getCardElement(card);
        var selectedCardsClass = this.getSelectedCardClass();
        element === null || element === void 0 ? void 0 : element.classList.remove(selectedCardsClass);
        var index = this.selectedCards.findIndex(function (c) { return _this.manager.getId(c) == _this.manager.getId(card); });
        if (index !== -1) {
            this.selectedCards.splice(index, 1);
        }
        if (!silent) {
            (_a = this.onSelectionChange) === null || _a === void 0 ? void 0 : _a.call(this, this.selectedCards.slice(), card);
        }
    };
    CardStock.prototype.selectAll = function (silent) {
        var _this = this;
        var _a;
        if (silent === void 0) { silent = false; }
        if (this.selectionMode == 'none') {
            return;
        }
        this.cards.forEach(function (c) { return _this.selectCard(c, true); });
        if (!silent) {
            (_a = this.onSelectionChange) === null || _a === void 0 ? void 0 : _a.call(this, this.selectedCards.slice(), null);
        }
    };
    CardStock.prototype.unselectAll = function (silent) {
        var _this = this;
        var _a;
        if (silent === void 0) { silent = false; }
        var cards = this.getCards();
        cards.forEach(function (c) { return _this.unselectCard(c, true); });
        if (!silent) {
            (_a = this.onSelectionChange) === null || _a === void 0 ? void 0 : _a.call(this, this.selectedCards.slice(), null);
        }
    };
    CardStock.prototype.bindClick = function () {
        var _this = this;
        var _a;
        (_a = this.element) === null || _a === void 0 ? void 0 : _a.addEventListener('click', function (event) {
            var cardDiv = event.target.closest('.card');
            if (!cardDiv) {
                return;
            }
            var card = _this.cards.find(function (c) { return _this.manager.getId(c) == cardDiv.id; });
            if (!card) {
                return;
            }
            _this.cardClick(card);
        });
    };
    CardStock.prototype.cardClick = function (card) {
        var _this = this;
        var _a;
        if (this.selectionMode != 'none') {
            var alreadySelected = this.selectedCards.some(function (c) { return _this.manager.getId(c) == _this.manager.getId(card); });
            if (alreadySelected) {
                this.unselectCard(card);
            }
            else {
                this.selectCard(card);
            }
        }
        (_a = this.onCardClick) === null || _a === void 0 ? void 0 : _a.call(this, card);
    };
    CardStock.prototype.animationFromElement = function (element, fromRect, settings) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var side, cardSides_1, animation, result;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        side = element.dataset.side;
                        if (settings.originalSide && settings.originalSide != side) {
                            cardSides_1 = element.getElementsByClassName('card-sides')[0];
                            cardSides_1.style.transition = 'none';
                            element.dataset.side = settings.originalSide;
                            setTimeout(function () {
                                cardSides_1.style.transition = null;
                                element.dataset.side = side;
                            });
                        }
                        animation = settings.animation;
                        if (animation) {
                            animation.settings.element = element;
                            animation.settings.fromRect = fromRect;
                        }
                        else {
                            animation = new BgaSlideAnimation({ element: element, fromRect: fromRect });
                        }
                        return [4, this.manager.animationManager.play(animation)];
                    case 1:
                        result = _b.sent();
                        return [2, (_a = result === null || result === void 0 ? void 0 : result.played) !== null && _a !== void 0 ? _a : false];
                }
            });
        });
    };
    CardStock.prototype.setCardVisible = function (card, visible, settings) {
        this.manager.setCardVisible(card, visible, settings);
    };
    CardStock.prototype.flipCard = function (card, settings) {
        this.manager.flipCard(card, settings);
    };
    CardStock.prototype.getSelectableCardClass = function () {
        var _a, _b;
        return ((_a = this.settings) === null || _a === void 0 ? void 0 : _a.selectableCardClass) === undefined ? this.manager.getSelectableCardClass() : (_b = this.settings) === null || _b === void 0 ? void 0 : _b.selectableCardClass;
    };
    CardStock.prototype.getUnselectableCardClass = function () {
        var _a, _b;
        return ((_a = this.settings) === null || _a === void 0 ? void 0 : _a.unselectableCardClass) === undefined ? this.manager.getUnselectableCardClass() : (_b = this.settings) === null || _b === void 0 ? void 0 : _b.unselectableCardClass;
    };
    CardStock.prototype.getSelectedCardClass = function () {
        var _a, _b;
        return ((_a = this.settings) === null || _a === void 0 ? void 0 : _a.selectedCardClass) === undefined ? this.manager.getSelectedCardClass() : (_b = this.settings) === null || _b === void 0 ? void 0 : _b.selectedCardClass;
    };
    CardStock.prototype.removeSelectionClasses = function (card) {
        this.removeSelectionClassesFromElement(this.getCardElement(card));
    };
    CardStock.prototype.removeSelectionClassesFromElement = function (cardElement) {
        var selectableCardsClass = this.getSelectableCardClass();
        var unselectableCardsClass = this.getUnselectableCardClass();
        var selectedCardsClass = this.getSelectedCardClass();
        cardElement === null || cardElement === void 0 ? void 0 : cardElement.classList.remove(selectableCardsClass, unselectableCardsClass, selectedCardsClass);
    };
    return CardStock;
}());
var SlideAndBackAnimation = (function (_super) {
    __extends(SlideAndBackAnimation, _super);
    function SlideAndBackAnimation(manager, element, tempElement) {
        var _this = this;
        var distance = (manager.getCardWidth() + manager.getCardHeight()) / 2;
        var angle = Math.random() * Math.PI * 2;
        var fromDelta = {
            x: distance * Math.cos(angle),
            y: distance * Math.sin(angle),
        };
        _this = _super.call(this, {
            animations: [
                new BgaSlideToAnimation({ element: element, fromDelta: fromDelta, duration: 250 }),
                new BgaSlideAnimation({ element: element, fromDelta: fromDelta, duration: 250, animationEnd: tempElement ? (function () { return element.remove(); }) : undefined }),
            ]
        }) || this;
        return _this;
    }
    return SlideAndBackAnimation;
}(BgaCumulatedAnimation));
var Deck = (function (_super) {
    __extends(Deck, _super);
    function Deck(manager, element, settings) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
        var _this = _super.call(this, manager, element) || this;
        _this.manager = manager;
        _this.element = element;
        element.classList.add('deck');
        var cardWidth = _this.manager.getCardWidth();
        var cardHeight = _this.manager.getCardHeight();
        if (cardWidth && cardHeight) {
            _this.element.style.setProperty('--width', "".concat(cardWidth, "px"));
            _this.element.style.setProperty('--height', "".concat(cardHeight, "px"));
        }
        else {
            throw new Error("You need to set cardWidth and cardHeight in the card manager to use Deck.");
        }
        _this.fakeCardGenerator = (_a = settings === null || settings === void 0 ? void 0 : settings.fakeCardGenerator) !== null && _a !== void 0 ? _a : manager.getFakeCardGenerator();
        _this.thicknesses = (_b = settings.thicknesses) !== null && _b !== void 0 ? _b : [0, 2, 5, 10, 20, 30];
        _this.setCardNumber((_c = settings.cardNumber) !== null && _c !== void 0 ? _c : 0);
        _this.autoUpdateCardNumber = (_d = settings.autoUpdateCardNumber) !== null && _d !== void 0 ? _d : true;
        _this.autoRemovePreviousCards = (_e = settings.autoRemovePreviousCards) !== null && _e !== void 0 ? _e : true;
        var shadowDirection = (_f = settings.shadowDirection) !== null && _f !== void 0 ? _f : 'bottom-right';
        var shadowDirectionSplit = shadowDirection.split('-');
        var xShadowShift = shadowDirectionSplit.includes('right') ? 1 : (shadowDirectionSplit.includes('left') ? -1 : 0);
        var yShadowShift = shadowDirectionSplit.includes('bottom') ? 1 : (shadowDirectionSplit.includes('top') ? -1 : 0);
        _this.element.style.setProperty('--xShadowShift', '' + xShadowShift);
        _this.element.style.setProperty('--yShadowShift', '' + yShadowShift);
        if (settings.topCard) {
            _this.addCard(settings.topCard);
        }
        else if (settings.cardNumber > 0) {
            _this.addCard(_this.getFakeCard());
        }
        if (settings.counter && ((_g = settings.counter.show) !== null && _g !== void 0 ? _g : true)) {
            if (settings.cardNumber === null || settings.cardNumber === undefined) {
                console.warn("Deck card counter created without a cardNumber");
            }
            _this.createCounter((_h = settings.counter.position) !== null && _h !== void 0 ? _h : 'bottom', (_j = settings.counter.extraClasses) !== null && _j !== void 0 ? _j : 'round', settings.counter.counterId);
            if ((_k = settings.counter) === null || _k === void 0 ? void 0 : _k.hideWhenEmpty) {
                _this.element.querySelector('.bga-cards_deck-counter').classList.add('hide-when-empty');
            }
        }
        _this.setCardNumber((_l = settings.cardNumber) !== null && _l !== void 0 ? _l : 0);
        return _this;
    }
    Deck.prototype.createCounter = function (counterPosition, extraClasses, counterId) {
        var left = counterPosition.includes('right') ? 100 : (counterPosition.includes('left') ? 0 : 50);
        var top = counterPosition.includes('bottom') ? 100 : (counterPosition.includes('top') ? 0 : 50);
        this.element.style.setProperty('--bga-cards-deck-left', "".concat(left, "%"));
        this.element.style.setProperty('--bga-cards-deck-top', "".concat(top, "%"));
        this.element.insertAdjacentHTML('beforeend', "\n            <div ".concat(counterId ? "id=\"".concat(counterId, "\"") : '', " class=\"bga-cards_deck-counter ").concat(extraClasses, "\"></div>\n        "));
    };
    Deck.prototype.getCardNumber = function () {
        return this.cardNumber;
    };
    Deck.prototype.setCardNumber = function (cardNumber, topCard) {
        var _this = this;
        if (topCard === void 0) { topCard = undefined; }
        var promise = Promise.resolve(false);
        var oldTopCard = this.getTopCard();
        if (topCard !== null && cardNumber > 0) {
            var newTopCard = topCard || this.getFakeCard();
            if (!oldTopCard || this.manager.getId(newTopCard) != this.manager.getId(oldTopCard)) {
                promise = this.addCard(newTopCard, undefined, { autoUpdateCardNumber: false });
            }
        }
        else if (cardNumber == 0 && oldTopCard) {
            promise = this.removeCard(oldTopCard, { autoUpdateCardNumber: false });
        }
        this.cardNumber = cardNumber;
        this.element.dataset.empty = (this.cardNumber == 0).toString();
        var thickness = 0;
        this.thicknesses.forEach(function (threshold, index) {
            if (_this.cardNumber >= threshold) {
                thickness = index;
            }
        });
        this.element.style.setProperty('--thickness', "".concat(thickness, "px"));
        var counterDiv = this.element.querySelector('.bga-cards_deck-counter');
        if (counterDiv) {
            counterDiv.innerHTML = "".concat(cardNumber);
        }
        return promise;
    };
    Deck.prototype.addCard = function (card, animation, settings) {
        var _this = this;
        var _a, _b;
        if ((_a = settings === null || settings === void 0 ? void 0 : settings.autoUpdateCardNumber) !== null && _a !== void 0 ? _a : this.autoUpdateCardNumber) {
            this.setCardNumber(this.cardNumber + 1, null);
        }
        var promise = _super.prototype.addCard.call(this, card, animation, settings);
        if ((_b = settings === null || settings === void 0 ? void 0 : settings.autoRemovePreviousCards) !== null && _b !== void 0 ? _b : this.autoRemovePreviousCards) {
            promise.then(function () {
                var previousCards = _this.getCards().slice(0, -1);
                _this.removeCards(previousCards, { autoUpdateCardNumber: false });
            });
        }
        return promise;
    };
    Deck.prototype.cardRemoved = function (card, settings) {
        var _a;
        if ((_a = settings === null || settings === void 0 ? void 0 : settings.autoUpdateCardNumber) !== null && _a !== void 0 ? _a : this.autoUpdateCardNumber) {
            this.setCardNumber(this.cardNumber - 1);
        }
        _super.prototype.cardRemoved.call(this, card, settings);
    };
    Deck.prototype.removeAll = function (settings) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var promise;
            return __generator(this, function (_c) {
                promise = _super.prototype.removeAll.call(this, __assign(__assign({}, settings), { autoUpdateCardNumber: (_a = settings === null || settings === void 0 ? void 0 : settings.autoUpdateCardNumber) !== null && _a !== void 0 ? _a : false }));
                if ((_b = settings === null || settings === void 0 ? void 0 : settings.autoUpdateCardNumber) !== null && _b !== void 0 ? _b : true) {
                    this.setCardNumber(0, null);
                }
                return [2, promise];
            });
        });
    };
    Deck.prototype.getTopCard = function () {
        var cards = this.getCards();
        return cards.length ? cards[cards.length - 1] : null;
    };
    Deck.prototype.shuffle = function (settings) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function () {
            var animatedCardsMax, animatedCards, elements, getFakeCard, uid, i, newCard, newElement, pauseDelayAfterAnimation;
            var _this = this;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        animatedCardsMax = (_a = settings === null || settings === void 0 ? void 0 : settings.animatedCardsMax) !== null && _a !== void 0 ? _a : 10;
                        this.addCard((_b = settings === null || settings === void 0 ? void 0 : settings.newTopCard) !== null && _b !== void 0 ? _b : this.getFakeCard(), undefined, { autoUpdateCardNumber: false });
                        if (!this.manager.animationsActive()) {
                            return [2, Promise.resolve(false)];
                        }
                        animatedCards = Math.min(10, animatedCardsMax, this.getCardNumber());
                        if (!(animatedCards > 1)) return [3, 4];
                        elements = [this.getCardElement(this.getTopCard())];
                        getFakeCard = function (uid) {
                            var newCard;
                            if (settings === null || settings === void 0 ? void 0 : settings.fakeCardSetter) {
                                newCard = {};
                                settings === null || settings === void 0 ? void 0 : settings.fakeCardSetter(newCard, uid);
                            }
                            else {
                                newCard = _this.fakeCardGenerator("".concat(_this.element.id, "-shuffle-").concat(uid));
                            }
                            return newCard;
                        };
                        uid = 0;
                        for (i = elements.length; i <= animatedCards; i++) {
                            newCard = void 0;
                            do {
                                newCard = getFakeCard(uid++);
                            } while (this.manager.getCardElement(newCard));
                            newElement = this.manager.createCardElement(newCard, false);
                            newElement.dataset.tempCardForShuffleAnimation = 'true';
                            this.element.prepend(newElement);
                            elements.push(newElement);
                        }
                        return [4, this.manager.animationManager.playWithDelay(elements.map(function (element) { return new SlideAndBackAnimation(_this.manager, element, element.dataset.tempCardForShuffleAnimation == 'true'); }), 50)];
                    case 1:
                        _d.sent();
                        pauseDelayAfterAnimation = (_c = settings === null || settings === void 0 ? void 0 : settings.pauseDelayAfterAnimation) !== null && _c !== void 0 ? _c : 500;
                        if (!(pauseDelayAfterAnimation > 0)) return [3, 3];
                        return [4, this.manager.animationManager.play(new BgaPauseAnimation({ duration: pauseDelayAfterAnimation }))];
                    case 2:
                        _d.sent();
                        _d.label = 3;
                    case 3: return [2, true];
                    case 4: return [2, Promise.resolve(false)];
                }
            });
        });
    };
    Deck.prototype.getFakeCard = function () {
        return this.fakeCardGenerator(this.element.id);
    };
    return Deck;
}(CardStock));
var LineStock = (function (_super) {
    __extends(LineStock, _super);
    function LineStock(manager, element, settings) {
        var _a, _b, _c, _d;
        var _this = _super.call(this, manager, element, settings) || this;
        _this.manager = manager;
        _this.element = element;
        element.classList.add('line-stock');
        element.dataset.center = ((_a = settings === null || settings === void 0 ? void 0 : settings.center) !== null && _a !== void 0 ? _a : true).toString();
        element.style.setProperty('--wrap', (_b = settings === null || settings === void 0 ? void 0 : settings.wrap) !== null && _b !== void 0 ? _b : 'wrap');
        element.style.setProperty('--direction', (_c = settings === null || settings === void 0 ? void 0 : settings.direction) !== null && _c !== void 0 ? _c : 'row');
        element.style.setProperty('--gap', (_d = settings === null || settings === void 0 ? void 0 : settings.gap) !== null && _d !== void 0 ? _d : '8px');
        return _this;
    }
    return LineStock;
}(CardStock));
var HandStock = (function (_super) {
    __extends(HandStock, _super);
    function HandStock(manager, element, settings) {
        var _a, _b, _c, _d;
        var _this = _super.call(this, manager, element, settings) || this;
        _this.manager = manager;
        _this.element = element;
        element.classList.add('hand-stock');
        element.style.setProperty('--card-overlap', (_a = settings.cardOverlap) !== null && _a !== void 0 ? _a : '60px');
        element.style.setProperty('--card-shift', (_b = settings.cardShift) !== null && _b !== void 0 ? _b : '15px');
        element.style.setProperty('--card-inclination', "".concat((_c = settings.inclination) !== null && _c !== void 0 ? _c : 12, "deg"));
        _this.inclination = (_d = settings.inclination) !== null && _d !== void 0 ? _d : 4;
        return _this;
    }
    HandStock.prototype.addCard = function (card, animation, settings) {
        var promise = _super.prototype.addCard.call(this, card, animation, settings);
        this.updateAngles();
        return promise;
    };
    HandStock.prototype.cardRemoved = function (card, settings) {
        _super.prototype.cardRemoved.call(this, card, settings);
        this.updateAngles();
    };
    HandStock.prototype.updateAngles = function () {
        var _this = this;
        var middle = (this.cards.length - 1) / 2;
        this.cards.forEach(function (card, index) {
            var middleIndex = index - middle;
            var cardElement = _this.getCardElement(card);
            cardElement.style.setProperty('--hand-stock-middle-index', "".concat(middleIndex));
            cardElement.style.setProperty('--hand-stock-middle-index-abs', "".concat(Math.abs(middleIndex)));
        });
    };
    return HandStock;
}(CardStock));
function sortFunction() {
    var sortedFields = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        sortedFields[_i] = arguments[_i];
    }
    return function (a, b) {
        for (var i = 0; i < sortedFields.length; i++) {
            var direction = 1;
            var field = sortedFields[i];
            if (field[0] == '-') {
                direction = -1;
                field = field.substring(1);
            }
            else if (field[0] == '+') {
                field = field.substring(1);
            }
            var type = typeof a[field];
            if (type === 'string') {
                var compare = a[field].localeCompare(b[field]);
                if (compare !== 0) {
                    return compare;
                }
            }
            else if (type === 'number') {
                var compare = (a[field] - b[field]) * direction;
                if (compare !== 0) {
                    return compare * direction;
                }
            }
        }
        return 0;
    };
}
var CardManager = (function () {
    function CardManager(game, settings) {
        var _a;
        this.game = game;
        this.settings = settings;
        this.stocks = [];
        this.updateMainTimeoutId = [];
        this.updateFrontTimeoutId = [];
        this.updateBackTimeoutId = [];
        this.animationManager = (_a = settings.animationManager) !== null && _a !== void 0 ? _a : new AnimationManager(game);
    }
    CardManager.prototype.animationsActive = function () {
        return this.animationManager.animationsActive();
    };
    CardManager.prototype.addStock = function (stock) {
        this.stocks.push(stock);
    };
    CardManager.prototype.removeStock = function (stock) {
        var index = this.stocks.indexOf(stock);
        if (index !== -1) {
            this.stocks.splice(index, 1);
        }
    };
    CardManager.prototype.getId = function (card) {
        var _a, _b, _c;
        return (_c = (_b = (_a = this.settings).getId) === null || _b === void 0 ? void 0 : _b.call(_a, card)) !== null && _c !== void 0 ? _c : "card-".concat(card.id);
    };
    CardManager.prototype.createCardElement = function (card, visible) {
        var _a, _b, _c, _d, _e, _f;
        if (visible === void 0) { visible = true; }
        var id = this.getId(card);
        var side = visible ? 'front' : 'back';
        if (this.getCardElement(card)) {
            throw new Error('This card already exists ' + JSON.stringify(card));
        }
        var element = document.createElement("div");
        element.id = id;
        element.dataset.side = '' + side;
        element.innerHTML = "\n            <div class=\"card-sides\">\n                <div id=\"".concat(id, "-front\" class=\"card-side front\">\n                </div>\n                <div id=\"").concat(id, "-back\" class=\"card-side back\">\n                </div>\n            </div>\n        ");
        element.classList.add('card');
        document.body.appendChild(element);
        (_b = (_a = this.settings).setupDiv) === null || _b === void 0 ? void 0 : _b.call(_a, card, element);
        (_d = (_c = this.settings).setupFrontDiv) === null || _d === void 0 ? void 0 : _d.call(_c, card, element.getElementsByClassName('front')[0]);
        (_f = (_e = this.settings).setupBackDiv) === null || _f === void 0 ? void 0 : _f.call(_e, card, element.getElementsByClassName('back')[0]);
        document.body.removeChild(element);
        return element;
    };
    CardManager.prototype.getCardElement = function (card) {
        return document.getElementById(this.getId(card));
    };
    CardManager.prototype.removeCard = function (card, settings) {
        var _a;
        var id = this.getId(card);
        var div = document.getElementById(id);
        if (!div) {
            return Promise.resolve(false);
        }
        div.id = "deleted".concat(id);
        div.remove();
        (_a = this.getCardStock(card)) === null || _a === void 0 ? void 0 : _a.cardRemoved(card, settings);
        return Promise.resolve(true);
    };
    CardManager.prototype.getCardStock = function (card) {
        return this.stocks.find(function (stock) { return stock.contains(card); });
    };
    CardManager.prototype.isCardVisible = function (card) {
        var _a, _b, _c, _d;
        return (_c = (_b = (_a = this.settings).isCardVisible) === null || _b === void 0 ? void 0 : _b.call(_a, card)) !== null && _c !== void 0 ? _c : ((_d = card.type) !== null && _d !== void 0 ? _d : false);
    };
    CardManager.prototype.setCardVisible = function (card, visible, settings) {
        var _this = this;
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
        var element = this.getCardElement(card);
        if (!element) {
            return;
        }
        var isVisible = visible !== null && visible !== void 0 ? visible : this.isCardVisible(card);
        element.dataset.side = isVisible ? 'front' : 'back';
        var stringId = JSON.stringify(this.getId(card));
        if ((_a = settings === null || settings === void 0 ? void 0 : settings.updateMain) !== null && _a !== void 0 ? _a : false) {
            if (this.updateMainTimeoutId[stringId]) {
                clearTimeout(this.updateMainTimeoutId[stringId]);
                delete this.updateMainTimeoutId[stringId];
            }
            var updateMainDelay = (_b = settings === null || settings === void 0 ? void 0 : settings.updateMainDelay) !== null && _b !== void 0 ? _b : 0;
            if (isVisible && updateMainDelay > 0 && this.animationsActive()) {
                this.updateMainTimeoutId[stringId] = setTimeout(function () { var _a, _b; return (_b = (_a = _this.settings).setupDiv) === null || _b === void 0 ? void 0 : _b.call(_a, card, element); }, updateMainDelay);
            }
            else {
                (_d = (_c = this.settings).setupDiv) === null || _d === void 0 ? void 0 : _d.call(_c, card, element);
            }
        }
        if ((_e = settings === null || settings === void 0 ? void 0 : settings.updateFront) !== null && _e !== void 0 ? _e : true) {
            if (this.updateFrontTimeoutId[stringId]) {
                clearTimeout(this.updateFrontTimeoutId[stringId]);
                delete this.updateFrontTimeoutId[stringId];
            }
            var updateFrontDelay = (_f = settings === null || settings === void 0 ? void 0 : settings.updateFrontDelay) !== null && _f !== void 0 ? _f : 500;
            if (!isVisible && updateFrontDelay > 0 && this.animationsActive()) {
                this.updateFrontTimeoutId[stringId] = setTimeout(function () { var _a, _b; return (_b = (_a = _this.settings).setupFrontDiv) === null || _b === void 0 ? void 0 : _b.call(_a, card, element.getElementsByClassName('front')[0]); }, updateFrontDelay);
            }
            else {
                (_h = (_g = this.settings).setupFrontDiv) === null || _h === void 0 ? void 0 : _h.call(_g, card, element.getElementsByClassName('front')[0]);
            }
        }
        if ((_j = settings === null || settings === void 0 ? void 0 : settings.updateBack) !== null && _j !== void 0 ? _j : false) {
            if (this.updateBackTimeoutId[stringId]) {
                clearTimeout(this.updateBackTimeoutId[stringId]);
                delete this.updateBackTimeoutId[stringId];
            }
            var updateBackDelay = (_k = settings === null || settings === void 0 ? void 0 : settings.updateBackDelay) !== null && _k !== void 0 ? _k : 0;
            if (isVisible && updateBackDelay > 0 && this.animationsActive()) {
                this.updateBackTimeoutId[stringId] = setTimeout(function () { var _a, _b; return (_b = (_a = _this.settings).setupBackDiv) === null || _b === void 0 ? void 0 : _b.call(_a, card, element.getElementsByClassName('back')[0]); }, updateBackDelay);
            }
            else {
                (_m = (_l = this.settings).setupBackDiv) === null || _m === void 0 ? void 0 : _m.call(_l, card, element.getElementsByClassName('back')[0]);
            }
        }
        if ((_o = settings === null || settings === void 0 ? void 0 : settings.updateData) !== null && _o !== void 0 ? _o : true) {
            var stock = this.getCardStock(card);
            var cards = stock.getCards();
            var cardIndex = cards.findIndex(function (c) { return _this.getId(c) === _this.getId(card); });
            if (cardIndex !== -1) {
                stock.cards.splice(cardIndex, 1, card);
            }
        }
    };
    CardManager.prototype.flipCard = function (card, settings) {
        var element = this.getCardElement(card);
        var currentlyVisible = element.dataset.side === 'front';
        this.setCardVisible(card, !currentlyVisible, settings);
    };
    CardManager.prototype.updateCardInformations = function (card, settings) {
        var newSettings = __assign(__assign({}, (settings !== null && settings !== void 0 ? settings : {})), { updateData: true });
        this.setCardVisible(card, undefined, newSettings);
    };
    CardManager.prototype.getCardWidth = function () {
        var _a;
        return (_a = this.settings) === null || _a === void 0 ? void 0 : _a.cardWidth;
    };
    CardManager.prototype.getCardHeight = function () {
        var _a;
        return (_a = this.settings) === null || _a === void 0 ? void 0 : _a.cardHeight;
    };
    CardManager.prototype.getSelectableCardClass = function () {
        var _a, _b;
        return ((_a = this.settings) === null || _a === void 0 ? void 0 : _a.selectableCardClass) === undefined ? 'bga-cards_selectable-card' : (_b = this.settings) === null || _b === void 0 ? void 0 : _b.selectableCardClass;
    };
    CardManager.prototype.getUnselectableCardClass = function () {
        var _a, _b;
        return ((_a = this.settings) === null || _a === void 0 ? void 0 : _a.unselectableCardClass) === undefined ? 'bga-cards_disabled-card' : (_b = this.settings) === null || _b === void 0 ? void 0 : _b.unselectableCardClass;
    };
    CardManager.prototype.getSelectedCardClass = function () {
        var _a, _b;
        return ((_a = this.settings) === null || _a === void 0 ? void 0 : _a.selectedCardClass) === undefined ? 'bga-cards_selected-card' : (_b = this.settings) === null || _b === void 0 ? void 0 : _b.selectedCardClass;
    };
    CardManager.prototype.getFakeCardGenerator = function () {
        var _this = this;
        var _a, _b;
        return (_b = (_a = this.settings) === null || _a === void 0 ? void 0 : _a.fakeCardGenerator) !== null && _b !== void 0 ? _b : (function (deckId) { return ({ id: _this.getId({ id: "".concat(deckId, "-fake-top-card") }) }); });
    };
    return CardManager;
}());
var CannonadesCardManager = (function (_super) {
    __extends(CannonadesCardManager, _super);
    function CannonadesCardManager(game, prefix) {
        var _this = _super.call(this, game, {
            getId: function (card) { return "".concat(prefix, "-").concat(card.id); },
            setupDiv: function (card, div) {
                div.dataset.type = card.type;
                div.dataset.typeArg = card.type_arg;
            },
            setupFrontDiv: function (card, div) {
                div.dataset.img = "" + _this.getImgPos(card);
                if ('type' in card) {
                    _this.game.addTooltipHtml(_this.getId(card), _this.getTooltip(card), 1000);
                }
            },
            setupBackDiv: function (card, div) {
                div.dataset.img = "0";
            },
            isCardVisible: function (card) { return "type_arg" in card; },
            cardWidth: 100,
            cardHeight: 140,
        }) || this;
        _this.game = game;
        return _this;
    }
    CannonadesCardManager.prototype.getImgPos = function (card) {
        if (this.isShip(card)) {
            return this.game.gamedatas.ship_types[Number(card.type_arg)].img;
        }
        if (this.isCannonade(card)) {
            return this.game.gamedatas.cannonade_types[Number(card.type_arg)].img;
        }
        return 0;
    };
    CannonadesCardManager.prototype.isShip = function (card) {
        return card.type === "1";
    };
    CannonadesCardManager.prototype.isCannonade = function (card) {
        return card.type === "2";
    };
    CannonadesCardManager.prototype.markAsSelected = function (card) {
        var _a;
        (_a = this.getCardElement(card)) === null || _a === void 0 ? void 0 : _a.classList.add('c-card-selected');
    };
    CannonadesCardManager.prototype.getTooltip = function (card) {
        return this.isShip(card) ? this.getTooltipShip(card) : this.getTooltipCannonade(card);
    };
    CannonadesCardManager.prototype.getTooltipShip = function (card) {
        var _a = this.game.gamedatas.ship_types[Number(card.type_arg)], color = _a.color, captain = _a.captain, count = _a.count;
        return "<div class=\"card-tooltip\">\n         <div class=\"header\">".concat(_('Ship'), "</div>\n         <table>\n            <tr><th>Color</th><td>").concat(color, "</td></tr>\n            <tr><th>Captain's Grin</th><td>").concat(captain, "</td></tr>\n            <tr><th>Count</th><td>").concat(count, "</td></tr>\n            </table>\n      </div>");
    };
    CannonadesCardManager.prototype.getTooltipCannonade = function (card) {
        var _a = this.game.gamedatas.cannonade_types[Number(card.type_arg)], colors = _a.colors, count = _a.count;
        return "<div class=\"card-tooltip\">\n         <div class=\"header\">".concat(_('Cannonade'), "</div>\n         <table>\n            <tr><th>Colors</th><td>").concat(colors.join(', '), "</td></tr>\n            <tr><th>Count</th><td>").concat(count, "</td></tr>\n         </table>\n      </div>");
    };
    return CannonadesCardManager;
}(CardManager));
var StockHand = (function (_super) {
    __extends(StockHand, _super);
    function StockHand(manager, element) {
        return _super.call(this, manager, element, {
            cardOverlap: "30px",
            cardShift: "6px",
            inclination: 6,
            sort: sortFunction("type", "type_arg", "id"),
        }) || this;
    }
    StockHand.prototype.addCard = function (card, animation, settings) {
        var _this = this;
        var copy = __assign({}, card);
        return new Promise(function (resolve) {
            _super.prototype.addCard.call(_this, copy, animation, settings)
                .then(function () {
                var count = _this.getCards().length;
                _this.element.dataset.count = count.toString();
            })
                .then(function () { return resolve(true); });
        });
    };
    StockHand.prototype.removeCard = function (card, settings) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2, new Promise(function (resolve) {
                        _super.prototype.removeCard.call(_this, card, settings)
                            .then(function () {
                            var count = _this.getCards().length;
                            _this.element.dataset.count = count.toString();
                        })
                            .then(function () { return resolve(true); });
                    })];
            });
        });
    };
    return StockHand;
}(HandStock));
var StockDiscard = (function (_super) {
    __extends(StockDiscard, _super);
    function StockDiscard(manager, element) {
        return _super.call(this, manager, element, {
            cardNumber: 0,
            counter: {
                hideWhenEmpty: false,
            },
            autoRemovePreviousCards: false,
        }) || this;
    }
    StockDiscard.prototype.addCard = function (card, animation, settings) {
        this.onAddCard(__assign({}, card));
        return _super.prototype.addCard.call(this, card, animation, settings);
    };
    StockDiscard.prototype.removeCard = function (card, settings) {
        this.onRemoveCard(__assign({}, card));
        return _super.prototype.removeCard.call(this, card, settings);
    };
    return StockDiscard;
}(Deck));
var NotificationManager = (function () {
    function NotificationManager(game) {
        this.game = game;
    }
    NotificationManager.prototype.setup = function () {
        var _this = this;
        var notifs = [
            ["onAddShip", undefined],
            ["onDiscardCard", 750],
            ["onDiscardHand", 750],
            ["onDrawCards", undefined],
            ["onPlayCard", 750],
            ["onRevealShip", 750],
            ["onUpdateScore", 10],
            ["playerEliminated", 100],
        ];
        this.setupNotifications(notifs);
        ["message", "onDrawCards"].forEach(function (eventName) {
            _this.game.notifqueue.setIgnoreNotificationCheck(eventName, function (notif) { return notif.args.excluded_player_id && notif.args.excluded_player_id == _this.game.player_id; });
        });
    };
    NotificationManager.prototype.notif_onAddShip = function (_a) {
        var card_id = _a.card_id, player_id = _a.player_id;
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4, this.game.getPlayerTable(player_id).board.addCard({ id: card_id.toString() })];
                    case 1:
                        _b.sent();
                        return [2];
                }
            });
        });
    };
    NotificationManager.prototype.notif_onDiscardCard = function (_a) {
        var card = _a.card, player_id = _a.player_id;
        this.game.tableCenter.discard.addCard(card);
    };
    NotificationManager.prototype.notif_onDiscardHand = function (_a) {
        var cards = _a.cards, player_id = _a.player_id;
        this.game.tableCenter.discard.addCards(cards);
    };
    NotificationManager.prototype.notif_onDrawCards = function (_a) {
        var cards = _a.cards, player_id = _a.player_id, discard = _a.discard;
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!discard) return [3, 2];
                        return [4, this.game.getPlayerTable(player_id).hand.addCards(cards, { fromStock: this.game.tableCenter.discard })];
                    case 1:
                        _b.sent();
                        return [3, 4];
                    case 2: return [4, this.game.getPlayerTable(player_id).hand.addCards(cards, { fromStock: this.game.tableCenter.deck })];
                    case 3:
                        _b.sent();
                        _b.label = 4;
                    case 4: return [2];
                }
            });
        });
    };
    NotificationManager.prototype.notif_onPlayCard = function (_a) {
        var card = _a.card, player_id = _a.player_id;
        this.game.tableCenter.played_card.addCard(card, {});
    };
    NotificationManager.prototype.notif_onRevealShip = function (_a) {
        var card = _a.card, player_id = _a.player_id;
        this.game.getPlayerTable(player_id).board.flipCard(card);
    };
    NotificationManager.prototype.notif_playerEliminated = function (args) {
        var player_id = Number(args.who_quits);
        this.game.eliminatePlayer(player_id);
    };
    NotificationManager.prototype.notif_onUpdateScore = function (_a) {
        var player_id = _a.player_id, player_score = _a.player_score;
        this.game.scoreCtrl[player_id].toValue(player_score);
    };
    NotificationManager.prototype.setupNotifications = function (notifs) {
        var _this = this;
        notifs.forEach(function (_a) {
            var eventName = _a[0], duration = _a[1];
            dojo.subscribe(eventName, _this, function (notifDetails) {
                console.log("notif_".concat(eventName), notifDetails.args);
                var promise = _this["notif_".concat(eventName)](notifDetails.args);
                promise === null || promise === void 0 ? void 0 : promise.then(function () { return _this.game.notifqueue.onSynchronousNotificationEnd(); });
            });
            _this.game.notifqueue.setSynchronous(eventName, duration);
        });
    };
    return NotificationManager;
}());
var PlayerTable = (function () {
    function PlayerTable(game, player) {
        this.game = game;
        this.player_id = Number(player.id);
        var html = "\n        <div id=\"player-table-".concat(player.id, "\" class=\"player-table whiteblock\" style=\"--player-color: #").concat(player.color, "\">\n            <div class=\"c-title\">").concat(player.name, "</div>\n            <div id=\"player-table-").concat(player.id, "-board\"></div>\n            <div id=\"player-table-").concat(player.id, "-hand\"></div>\n        </div>");
        var pos = this.player_id === game.getPlayerId() ? "afterbegin" : "beforeend";
        document.getElementById("tables").insertAdjacentHTML(pos, html);
        this.setupBoard(game);
        this.setupHand(game);
    }
    PlayerTable.prototype.setupBoard = function (game) {
        this.board = new LineStock(this.game.cardManager, document.getElementById("player-table-".concat(this.player_id, "-board")), {});
        this.board.addCards(game.gamedatas.players_info[this.player_id].board);
    };
    PlayerTable.prototype.setupHand = function (game) {
        this.hand = new StockHand(this.game.cardManager, document.getElementById("player-table-".concat(this.player_id, "-hand")));
        this.hand.addCards(game.gamedatas.players_info[this.player_id].hand);
    };
    return PlayerTable;
}());
var TableCenter = (function () {
    function TableCenter(game) {
        this.game = game;
        this.setupDeck(game);
        this.setupDiscard(game);
        this.setupPlayedCard(game);
    }
    TableCenter.prototype.displayDiscard = function (visible) {
        document.getElementById("table").dataset.display_discard = visible ? "true" : "false";
    };
    TableCenter.prototype.setupDeck = function (game) {
        this.deck = new Deck(game.cardManager, document.getElementById("deck"), {
            cardNumber: game.gamedatas.deck_count,
            topCard: { id: "deck-visible-fake-card" },
            counter: {
                hideWhenEmpty: false,
            },
            fakeCardGenerator: function (deckId) { return ({ id: "".concat(deckId, "-visible-fake-card") }); },
        });
    };
    TableCenter.prototype.setupDiscard = function (game) {
        var _this = this;
        var html = "<div id=\"discard-display-wrapper\" class=\"whiteblock\">\n         <div class=\"c-title\">".concat(_("Discard"), "</div>\n         <div id=\"discard-display\"></div>\n      </div>");
        document.getElementById("zones").insertAdjacentHTML("beforeend", html);
        this.discard_faceup = new LineStock(game.discardManager, document.getElementById("discard-display"), {
            gap: "2px",
            center: false,
        });
        this.discard = new StockDiscard(game.cardManager, document.getElementById("discard"));
        this.discard.onAddCard = function (card) {
            _this.discard_faceup.addCard(card);
        };
        this.discard.onRemoveCard = function (card) {
            _this.discard_faceup.removeCard(card);
        };
        this.discard.addCards(game.gamedatas.discard);
        document
            .getElementById("discard")
            .insertAdjacentHTML("afterbegin", "<div id=\"eye-icon-discard\" class=\"eye-icon discard\"></div>");
        var tableElement = document.getElementById("table");
        document.getElementById("eye-icon-discard").addEventListener("click", function () {
            tableElement.dataset.display_discard = tableElement.dataset.display_discard == "false" ? "true" : "false";
        });
    };
    TableCenter.prototype.setupPlayedCard = function (game) {
        this.played_card = new LineStock(game.cardManager, document.getElementById("played-card"));
    };
    return TableCenter;
}());
var StateManager = (function () {
    function StateManager(game) {
        this.game = game;
        this.states = {
            vendettaDiscardCard: new VendettaDiscardCardState(game),
            playerTurn: new PlayerTurnState(game),
            playerTurnShoot: new PlayerTurnShootState(game),
            playerTurnBoard: new PlayerTurnShootState(game),
            playerTurnDiscard: new PlayerTurnDiscardState(game),
            playerTurnStandoff: new PlayerTurnStandoffState(game),
            vendetta: new VendettaState(game),
            vendettaFlip: new VendettaFlipState(game),
            vendedtaDiscardCard: new VendettaDiscardCardState(game),
        };
    }
    StateManager.prototype.onEnteringState = function (stateName, args) {
        console.log("Entering state: ".concat(stateName));
        console.log("|- args :", args === null || args === void 0 ? void 0 : args.args);
        if (this.states[stateName] !== undefined) {
            this.states[stateName].onEnteringState(args.args);
        }
    };
    StateManager.prototype.onLeavingState = function (stateName) {
        console.log("Leaving state: ".concat(stateName));
        if (this.states[stateName] !== undefined) {
            document.getElementById("customActions").innerHTML = "";
            this.states[stateName].onLeavingState();
        }
        document.querySelectorAll(".c-card-selected").forEach(function (div) { return div.classList.remove("c-card-selected"); });
    };
    StateManager.prototype.onUpdateActionButtons = function (stateName, args) {
        console.log("Update action buttons: ".concat(stateName));
        if (this.states[stateName] !== undefined && this.game.isCurrentPlayerActive()) {
            this.states[stateName].onUpdateActionButtons(args);
        }
    };
    return StateManager;
}());
var VendettaDiscardCardState = (function () {
    function VendettaDiscardCardState(game) {
        this.game = game;
    }
    VendettaDiscardCardState.prototype.onEnteringState = function (args) {
        var _this = this;
        if (!this.game.isCurrentPlayerActive())
            return;
        var hand = this.game.getCurrentPlayerTable().hand;
        var handleSelectionChange = function (selection) {
            _this.game.toggleButton("btn_confirm", selection.length === 1);
        };
        hand.setSelectionMode("single");
        hand.onSelectionChange = handleSelectionChange;
    };
    VendettaDiscardCardState.prototype.onLeavingState = function () {
        var hand = this.game.getCurrentPlayerTable().hand;
        hand.setSelectionMode("none");
        hand.onSelectionChange = undefined;
    };
    VendettaDiscardCardState.prototype.onUpdateActionButtons = function (args) {
        var _this = this;
        var hand = this.game.getCurrentPlayerTable().hand;
        var handleConfirm = function () {
            var cards = hand.getSelection();
            if (cards.length !== 1)
                return;
            _this.game.takeAction("discardCardForVendetta", { card_id: cards[0].id });
        };
        this.game.addPrimaryActionButton("btn_confirm", _("Confirm"), handleConfirm);
        this.game.toggleButton('btn_confirm', false);
    };
    return VendettaDiscardCardState;
}());
var PlayerTurnState = (function () {
    function PlayerTurnState(game) {
        this.game = game;
    }
    PlayerTurnState.prototype.onEnteringState = function (_a) {
        var can_add_ship = _a.can_add_ship, can_shoot_cannonades = _a.can_shoot_cannonades, standoff = _a.standoff;
        if (!this.game.isCurrentPlayerActive())
            return;
        this.can_add_ship = can_add_ship;
        this.can_shoot_cannonades = can_shoot_cannonades;
        this.standoff = standoff;
        this.setupBoard();
        this.setupHand();
        this.checkButtons();
    };
    PlayerTurnState.prototype.onLeavingState = function () {
        var _a = this.game.getCurrentPlayerTable(), hand = _a.hand, board = _a.board;
        board.setSelectionMode("none");
        board.onSelectionChange = undefined;
        hand.setSelectionMode("none");
        hand.onSelectionChange = undefined;
    };
    PlayerTurnState.prototype.onUpdateActionButtons = function (args) {
        this.addButtonAdd();
        this.addButtonShoot(args);
        this.addButtonDiscard(args);
        this.addButtonBoard(args);
        this.addButtonPass(args);
    };
    PlayerTurnState.prototype.addButtonAdd = function () {
        var _this = this;
        var handleAdd = function () {
            var selection = _this.game.getCurrentPlayerTable().hand.getSelection();
            if (selection.length !== 1)
                return;
            _this.game.takeAction("addShip", { card_id: selection[0].id });
        };
        this.game.addPrimaryActionButton("btn_add", _("Add a new ship"), handleAdd);
    };
    PlayerTurnState.prototype.addButtonBoard = function (_a) {
        var _this = this;
        var can_shoot_cannonades = _a.can_shoot_cannonades;
        if (!can_shoot_cannonades)
            return;
        var handleBoardDanger = function () {
            _this.game.confirmationDialog("You will be eliminated from this game since it's your last ship. Do you want to continue?", function () { return handleBoard(); });
        };
        var handleBoard = function () {
            _this.game.setClientState("playerTurnBoard", {
                descriptionmyturn: _("Select an opponent ship"),
                args: {
                    card: _this.game.getCurrentPlayerTable().board.getSelection()[0],
                    action: "boardShip",
                },
            });
        };
        if (this.game.getCurrentPlayerTable().board.getCards().length === 1) {
            this.game.addDangerActionButton("btn_board", _("Board a ship"), handleBoardDanger);
        }
        else {
            this.game.addPrimaryActionButton("btn_board", _("Board a ship"), handleBoard);
        }
    };
    PlayerTurnState.prototype.addButtonDiscard = function (_a) {
        var _this = this;
        var can_shoot_cannonades = _a.can_shoot_cannonades, actions_remaining = _a.actions_remaining, standoff = _a.standoff;
        var handleDiscardVerification = function () {
            var willLoseGame = !can_shoot_cannonades &&
                actions_remaining == 1 &&
                _this.game.getCurrentPlayerTable().board.getCards().length == 0;
            if (willLoseGame) {
                _this.game.confirmationDialog(_("You will be eliminated if you don't add a ship on your board."), function () {
                    return handleDiscard();
                });
            }
            else {
                handleDiscard();
            }
        };
        var handleDiscard = function () {
            var selection = _this.game.getCurrentPlayerTable().hand.getSelection();
            if (selection.length !== 1)
                return;
            _this.game.takeAction("discardCard", { card_id: selection[0].id });
        };
        if (!standoff) {
            this.game.addPrimaryActionButton("btn_draw", _("Discard a card to draw"), handleDiscardVerification);
        }
    };
    PlayerTurnState.prototype.addButtonPass = function (_a) {
        var _this = this;
        var can_shoot_cannonades = _a.can_shoot_cannonades;
        var board = this.game.getCurrentPlayerTable().board;
        var handlePass = function () {
            if (!can_shoot_cannonades && board.getCards().length == 0) {
                _this.game.confirmationDialog(_("You will be eliminated if you don't add a ship on your board."), function () {
                    return _this.game.takeAction("pass");
                });
            }
            else {
                _this.game.takeAction("pass");
            }
        };
        this.game.addDangerActionButton("btn_pass", _("Pass"), handlePass);
    };
    PlayerTurnState.prototype.addButtonShoot = function (_a) {
        var _this = this;
        var can_shoot_cannonades = _a.can_shoot_cannonades;
        if (!can_shoot_cannonades)
            return;
        var handleShoot = function () {
            _this.game.setClientState("playerTurnShoot", {
                descriptionmyturn: _("Select an opponent ship"),
                args: {
                    card: _this.game.getCurrentPlayerTable().hand.getSelection()[0],
                    action: "shootCannonade",
                },
            });
        };
        if (can_shoot_cannonades) {
            this.game.addPrimaryActionButton("btn_shoot", _("Shoot an opponent's ship"), handleShoot);
        }
    };
    PlayerTurnState.prototype.setupBoard = function () {
        var _this = this;
        var _a = this.game.getCurrentPlayerTable(), hand = _a.hand, board = _a.board;
        var handleSelectBoard = function (selection) {
            if (selection.length == 1) {
                hand.unselectAll();
            }
            _this.checkButtons();
        };
        var selectableCardsBoard = board.getCards().filter(function (card) { return "type_arg" in card; });
        board.setSelectionMode("single");
        board.setSelectableCards(selectableCardsBoard);
        board.onSelectionChange = handleSelectBoard;
    };
    PlayerTurnState.prototype.setupHand = function () {
        var _this = this;
        var _a = this.game.getCurrentPlayerTable(), hand = _a.hand, board = _a.board;
        var handleSelectHand = function (selection) {
            if (selection.length == 1) {
                board.unselectAll();
            }
            _this.checkButtons();
        };
        hand.setSelectionMode("single");
        hand.onSelectionChange = handleSelectHand;
    };
    PlayerTurnState.prototype.checkButtons = function () {
        var _a = this.game.getCurrentPlayerTable(), hand = _a.hand, board = _a.board;
        var _b = board.getSelection(), cardBoard = _b[0], otherBoard = _b.slice(1);
        var _c = hand.getSelection(), cardHand = _c[0], otherHand = _c.slice(1);
        var canAdd = this.can_add_ship && cardHand && this.game.cardManager.isShip(cardHand);
        var canShoot = this.can_shoot_cannonades && cardHand && this.game.cardManager.isCannonade(cardHand);
        this.game.toggleButton("btn_add", canAdd);
        this.game.toggleButton("btn_shoot", canShoot);
        this.game.toggleButton("btn_draw", cardHand !== undefined && !this.standoff);
        this.game.toggleButton("btn_board", cardBoard !== undefined);
    };
    return PlayerTurnState;
}());
var PlayerTurnDiscardState = (function () {
    function PlayerTurnDiscardState(game) {
        this.game = game;
    }
    PlayerTurnDiscardState.prototype.onEnteringState = function (_a) {
        var _this = this;
        var nbr = _a.nbr;
        if (!this.game.isCurrentPlayerActive())
            return;
        var hand = this.game.getCurrentPlayerTable().hand;
        var handleSelectionChange = function (selection) {
            _this.game.toggleButton("btn_confirm", selection.length === nbr);
        };
        hand.setSelectionMode("multiple");
        hand.onSelectionChange = handleSelectionChange;
    };
    PlayerTurnDiscardState.prototype.onLeavingState = function () {
        var hand = this.game.getCurrentPlayerTable().hand;
        hand.setSelectionMode("none");
        hand.onSelectionChange = undefined;
    };
    PlayerTurnDiscardState.prototype.onUpdateActionButtons = function (_a) {
        var _this = this;
        var nbr = _a.nbr;
        var handleConfirm = function () {
            var hand = _this.game.getCurrentPlayerTable().hand;
            var cards = hand.getSelection();
            if (cards.length !== nbr)
                return;
            var card_ids = cards.map(function (card) { return card.id; }).join(";");
            _this.game.takeAction("discard", { card_ids: card_ids });
        };
        this.game.addPrimaryActionButton("btn_confirm", _("Confirm"), handleConfirm);
        this.game.toggleButton("btn_confirm", false);
    };
    return PlayerTurnDiscardState;
}());
var PlayerTurnShootState = (function () {
    function PlayerTurnShootState(game) {
        this.game = game;
    }
    PlayerTurnShootState.prototype.onEnteringState = function (_a) {
        var _this = this;
        var card = _a.card;
        this.game.cardManager.markAsSelected(card);
        var handleSelectionChange = function (table, selection) {
            if (selection.length === 1) {
                _this.unselectAllOthersBoards(table);
            }
            _this.game.toggleButton("btn_confirm", selection.length === 1);
        };
        var _loop_3 = function (player_table) {
            player_table.board.setSelectionMode("single");
            player_table.board.onSelectionChange = function (selection) {
                return handleSelectionChange(player_table, selection);
            };
        };
        for (var _i = 0, _b = this.game.getOpponentsPlayerTable(); _i < _b.length; _i++) {
            var player_table = _b[_i];
            _loop_3(player_table);
        }
    };
    PlayerTurnShootState.prototype.onLeavingState = function () {
        for (var _i = 0, _a = this.game.getOpponentsPlayerTable(); _i < _a.length; _i++) {
            var player_table = _a[_i];
            player_table.board.setSelectionMode("none");
            player_table.board.onSelectionChange = undefined;
        }
        this.game.getCurrentPlayerTable().hand.unselectAll();
    };
    PlayerTurnShootState.prototype.onUpdateActionButtons = function (_a) {
        var _this = this;
        var card = _a.card, action = _a.action;
        var handleConfirm = function () {
            var cards = _this.game
                .getOpponentsPlayerTable()
                .map(function (x) { return x.board; })
                .reduce(function (cards, curr) {
                curr.getSelection().forEach(function (c) { return cards.push(c); });
                return cards;
            }, []);
            if (cards.length !== 1)
                return;
            _this.game.takeAction(action, {
                card_id: card.id,
                ship_id: cards[0].id,
            });
        };
        this.game.addPrimaryActionButton("btn_confirm", _("Confirm"), handleConfirm);
        this.game.addActionButtonClientCancel();
    };
    PlayerTurnShootState.prototype.unselectAllOthersBoards = function (excluded_table) {
        for (var _i = 0, _a = this.game.getOpponentsPlayerTable(); _i < _a.length; _i++) {
            var player_table = _a[_i];
            if (excluded_table !== player_table) {
                player_table.board.unselectAll();
            }
        }
    };
    return PlayerTurnShootState;
}());
var PlayerTurnStandoffState = (function () {
    function PlayerTurnStandoffState(game) {
        this.game = game;
    }
    PlayerTurnStandoffState.prototype.onEnteringState = function (args) {
        var _this = this;
        this.game.displayStandoff();
        if (!this.game.isCurrentPlayerActive())
            return;
        var discard = this.game.tableCenter.discard_faceup;
        this.game.tableCenter.displayDiscard(true);
        var handleSelectionChange = function (selection) {
            _this.game.toggleButton("btn_confirm", selection.length === 1);
        };
        discard.setSelectionMode("single");
        discard.setSelectableCards(discard.getCards().filter(function (card) { return _this.game.discardManager.isCannonade(card); }));
        discard.onSelectionChange = handleSelectionChange;
    };
    PlayerTurnStandoffState.prototype.onLeavingState = function () {
        this.game.tableCenter.displayDiscard(false);
        var discard = this.game.tableCenter.discard_faceup;
        discard.setSelectionMode("none");
        discard.onSelectionChange = undefined;
    };
    PlayerTurnStandoffState.prototype.onUpdateActionButtons = function (args) {
        var _this = this;
        var handleConfirm = function () {
            var discard = _this.game.tableCenter.discard_faceup;
            var cards = discard.getSelection();
            if (cards.length !== 1)
                return;
            _this.game.takeAction("standoff", { card_id: Number(cards[0].id) });
        };
        this.game.addPrimaryActionButton("btn_confirm", _("Confirm"), handleConfirm);
        this.game.toggleButton("btn_confirm", false);
    };
    return PlayerTurnStandoffState;
}());
var VendettaState = (function () {
    function VendettaState(game) {
        this.game = game;
    }
    VendettaState.prototype.onEnteringState = function (args) { };
    VendettaState.prototype.onLeavingState = function () { };
    VendettaState.prototype.onUpdateActionButtons = function (args) {
        console.log(args);
        this.addButtonDraw(args);
        this.addButtonDiscard(args);
        this.addButtonFlip(args);
    };
    VendettaState.prototype.addButtonDraw = function (_a) {
        var _this = this;
        var deck_count = _a.deck_count;
        var handleDraw = function () { return _this.game.takeAction("vendettaDrawCard"); };
        this.game.addPrimaryActionButton("btn_draw", _("Draw a card"), handleDraw);
        this.game.toggleButton('btn_draw', deck_count > 0);
    };
    VendettaState.prototype.addButtonDiscard = function (_a) {
        var _this = this;
        var player_name = _a.player_name, player_hand_count = _a.player_hand_count;
        var handleDiscard = function () { return _this.game.takeAction("vendettaDiscardCard"); };
        this.game.addPrimaryActionButton("btn_discard", _("${player_name} discard a card").replace("${player_name}", player_name), handleDiscard);
        this.game.toggleButton("btn_discard", player_hand_count > 0);
    };
    VendettaState.prototype.addButtonFlip = function (_a) {
        var _this = this;
        var player_id = _a.player_id, player_name = _a.player_name, hidden_ships = _a.hidden_ships;
        var handleFlip = function () {
            if (hidden_ships.length === 1) {
                _this.game.takeAction("vendettaFlipShip", { ship_id: hidden_ships[0] });
            }
            else {
                _this.game.setClientState("vendettaFlip", {
                    descriptionmyturn: _("Select a ship to flip"),
                    args: {
                        player_id: player_id,
                        hidden_ships: hidden_ships,
                    },
                });
            }
        };
        this.game.addPrimaryActionButton("btn_flip", _("${player_name} turn a ship face up").replace("${player_name}", player_name), handleFlip);
        this.game.toggleButton("btn_flip", hidden_ships.length > 0);
    };
    return VendettaState;
}());
var VendettaFlipState = (function () {
    function VendettaFlipState(game) {
        this.game = game;
    }
    VendettaFlipState.prototype.onEnteringState = function (_a) {
        var _this = this;
        var player_id = _a.player_id, hidden_ships = _a.hidden_ships;
        this.player_id = player_id;
        var handleSelectionChange = function (selection) {
            _this.game.toggleButton("btn_confirm", selection.length === 1);
        };
        var board = this.game.getPlayerTable(this.player_id).board;
        var selectable = board.getCards().filter(function (card) { return hidden_ships.includes(card['id']); });
        board.setSelectionMode("single");
        board.setSelectableCards(selectable);
        board.onSelectionChange = handleSelectionChange;
    };
    VendettaFlipState.prototype.onLeavingState = function () {
        var board = this.game.getPlayerTable(this.player_id).board;
        board.setSelectionMode("none");
        board.onSelectionChange = undefined;
    };
    VendettaFlipState.prototype.onUpdateActionButtons = function (_a) {
        var _this = this;
        var player_id = _a.player_id;
        var handleConfirm = function () {
            var selection = _this.game.getPlayerTable(player_id).board.getSelection();
            if (selection.length !== 1)
                return;
            _this.game.takeAction("vendettaFlipShip", { ship_id: selection[0].id });
        };
        this.game.addPrimaryActionButton("btn_confirm", _("Confirm"), handleConfirm);
        this.game.addActionButtonClientCancel();
    };
    return VendettaFlipState;
}());
var Cannonades = (function () {
    function Cannonades() {
    }
    Cannonades.prototype.setup = function (gamedatas) {
        var maintitlebar = document.getElementById("maintitlebar_content");
        maintitlebar.insertAdjacentHTML("beforeend", "<div id='customActions'></div>");
        maintitlebar.insertAdjacentHTML("beforeend", "<div id='standoff'>".concat(_("Standoff"), "</div>"));
        this.stateManager = new StateManager(this);
        this.cardManager = new CannonadesCardManager(this, "card");
        this.discardManager = new CannonadesCardManager(this, "discard-card");
        this.notifManager = new NotificationManager(this);
        this.tableCenter = new TableCenter(this);
        this.createPlayerTables(gamedatas);
        this.setupNotifications();
        this.addReloadButton();
        if (gamedatas.is_standoff) {
            this.displayStandoff();
        }
    };
    Cannonades.prototype.onEnteringState = function (stateName, args) {
        this.stateManager.onEnteringState(stateName, args);
    };
    Cannonades.prototype.onLeavingState = function (stateName) {
        this.stateManager.onLeavingState(stateName);
    };
    Cannonades.prototype.onUpdateActionButtons = function (stateName, args) {
        this.stateManager.onUpdateActionButtons(stateName, args);
    };
    Cannonades.prototype.setupNotifications = function () {
        this.notifManager.setup();
    };
    Cannonades.prototype.addReloadButton = function () {
        var parent = document.querySelector('.debug_section');
        if (parent) {
            this.addActionButton('reload_css', _('Reload CSS'), function () { return reloadCss(); }, parent, null, 'gray');
        }
    };
    Cannonades.prototype.createPlayerTables = function (gamedatas) {
        var _this = this;
        this.playersTables = [];
        gamedatas.playerorder.forEach(function (player_id) {
            var player = gamedatas.players[Number(player_id)];
            var table = new PlayerTable(_this, player);
            _this.playersTables.push(table);
            if (player.eliminated) {
                setTimeout(function () { return _this.eliminatePlayer(Number(player_id)); }, 200);
            }
        });
    };
    Cannonades.prototype.addPrimaryActionButton = function (id, text, callback, zone) {
        if (zone === void 0) { zone = "customActions"; }
        if (!document.getElementById(id)) {
            this.addActionButton(id, text, callback, zone, false, "blue");
        }
    };
    Cannonades.prototype.addSecondaryActionButton = function (id, text, callback, zone) {
        if (zone === void 0) { zone = "customActions"; }
        if (!document.getElementById(id)) {
            this.addActionButton(id, text, callback, zone, false, "gray");
        }
    };
    Cannonades.prototype.addDangerActionButton = function (id, text, callback, zone) {
        if (zone === void 0) { zone = "customActions"; }
        if (!document.getElementById(id)) {
            this.addActionButton(id, text, callback, zone, false, "red");
        }
    };
    Cannonades.prototype.addActionButtonClientCancel = function () {
        var _this = this;
        var handleCancel = function (evt) {
            evt.stopPropagation();
            evt.preventDefault();
            _this.restoreGameState();
        };
        this.addSecondaryActionButton("btnCancelAction", _("Cancel"), handleCancel);
    };
    Cannonades.prototype.displayStandoff = function () {
        document.getElementsByTagName("body")[0].dataset.standoff = "true";
    };
    Cannonades.prototype.eliminatePlayer = function (player_id) {
        this.gamedatas.players[player_id].eliminated = 1;
        document.getElementById("overall_player_board_".concat(player_id)).classList.add("eliminated-player");
        document.getElementById("player-table-".concat(player_id)).classList.add("eliminated-player");
    };
    Cannonades.prototype.getPlayerId = function () {
        return Number(this.player_id);
    };
    Cannonades.prototype.getPlayerTable = function (playerId) {
        return this.playersTables.find(function (playerTable) { return playerTable.player_id === playerId; });
    };
    Cannonades.prototype.getCurrentPlayerTable = function () {
        return this.getPlayerTable(this.getPlayerId());
    };
    Cannonades.prototype.getOpponentsPlayerTable = function () {
        var playerId = this.getPlayerId();
        return this.playersTables.filter(function (playerTable) { return playerTable.player_id !== playerId; });
    };
    Cannonades.prototype.restoreGameState = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.restoreServerGameState();
                return [2];
            });
        });
    };
    Cannonades.prototype.toggleButton = function (id, enabled) {
        var _a;
        (_a = document.getElementById(id)) === null || _a === void 0 ? void 0 : _a.classList.toggle("disabled", !enabled);
    };
    Cannonades.prototype.takeAction = function (action, data, onSuccess, onComplete) {
        data = data || {};
        data.lock = true;
        onSuccess = onSuccess !== null && onSuccess !== void 0 ? onSuccess : function (result) { };
        onComplete = onComplete !== null && onComplete !== void 0 ? onComplete : function (is_error) { };
        this.ajaxcall("/cannonades/cannonades/".concat(action, ".html"), data, this, onSuccess, onComplete);
    };
    Cannonades.prototype.format_string_recursive = function (log, args) {
        try {
            if (log && args && !args.processed) {
                args.processed = true;
                if (args.card_image !== undefined) {
                    var img_pos = this.cardManager.getImgPos(args.card_image);
                    args.card_image = "<div class=\"card card-log\">\n                  <div class=\"card-sides\">\n                     <div class=\"card-side front\" data-img=\"".concat(img_pos, "\"></div>\n                  </div>\n               </div>");
                }
            }
        }
        catch (e) {
            console.error(log, args, "Exception thrown", e.stack);
        }
        return this.inherited(arguments);
    };
    return Cannonades;
}());
function reloadCss() {
    var links = document.getElementsByTagName('link');
    for (var cl in links) {
        var link = links[cl];
        if (link.rel === 'stylesheet' && link.href.includes('99999')) {
            var index = link.href.indexOf('?timestamp=');
            var href = link.href;
            if (index >= 0) {
                href = href.substring(0, index);
            }
            link.href = href + '?timestamp=' + Date.now();
            console.log('reloading ' + link.href);
        }
    }
}
define([
    "dojo",
    "dojo/_base/declare",
    "ebg/core/gamegui",
    "ebg/counter",
    "ebg/stock",
], function (dojo, declare) {
    return declare("bgagame.cannonades", [ebg.core.gamegui], new Cannonades());
});
