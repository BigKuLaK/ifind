"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("@custom-types");
require("@scripts");
var strapi_custom_1 = __importDefault(require("@scripts/strapi-custom"));
var amazon_1 = require("@helpers/amazon");
var ebay_1 = require("@helpers/ebay");
var aliexpress_1 = require("@helpers/aliexpress");
exports.default = (function (forced) {
    if (forced === void 0) { forced = false; }
    return __awaiter(void 0, void 0, void 0, function () {
        var strapi, queryParams, sources, foundProducts, productsWithIssues, ebaySource, aliexpressSource, _loop_1, i;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, strapi_custom_1.default()];
                case 1:
                    strapi = _a.sent();
                    queryParams = {
                        _limit: 9999,
                        status: "published",
                    };
                    // Include all products if forced is true
                    if (forced && queryParams.status) {
                        delete queryParams.status;
                    }
                    return [4 /*yield*/, strapi.services.source.find()];
                case 2:
                    sources = _a.sent();
                    return [4 /*yield*/, strapi.services.product.find(queryParams)];
                case 3:
                    foundProducts = _a.sent();
                    productsWithIssues = [];
                    ebaySource = sources.find(function (_a) {
                        var name = _a.name;
                        return /ebay/i.test(name);
                    });
                    aliexpressSource = sources.find(function (_a) {
                        var name = _a.name;
                        return /ali/i.test(name);
                    });
                    console.log(("Running validator on " + foundProducts.length + " product(s)...").cyan);
                    _loop_1 = function (i) {
                        var product, productIssues, scrapedDetails, err_1, _i, _b, urlData, _c;
                        return __generator(this, function (_d) {
                            switch (_d.label) {
                                case 0:
                                    product = foundProducts[i];
                                    productIssues = [];
                                    console.log(("[ " + (i + 1) + " of " + foundProducts.length + " ]").cyan.bold +
                                        (" Validating - [" + String(product.id).bold + "] " + product.title));
                                    if (!!amazon_1.isAmazonLink(product.amazon_url)) return [3 /*break*/, 1];
                                    productIssues.push("amazon_link_invalid");
                                    return [3 /*break*/, 4];
                                case 1:
                                    _d.trys.push([1, 3, , 4]);
                                    return [4 /*yield*/, amazon_1.scrapeAmazonProduct(product.amazon_url, "en", true)];
                                case 2:
                                    scrapedDetails = _d.sent();
                                    if (!scrapedDetails) {
                                        productIssues.push("amazon_link_unavailable");
                                    }
                                    return [3 /*break*/, 4];
                                case 3:
                                    err_1 = _d.sent();
                                    productIssues.push("amazon_link_unavailable");
                                    return [3 /*break*/, 4];
                                case 4:
                                    if (!(product.url_list && product.url_list.length)) return [3 /*break*/, 11];
                                    _i = 0, _b = product.url_list;
                                    _d.label = 5;
                                case 5:
                                    if (!(_i < _b.length)) return [3 /*break*/, 11];
                                    urlData = _b[_i];
                                    _c = urlData.source.id;
                                    switch (_c) {
                                        case ebaySource.id: return [3 /*break*/, 6];
                                        case aliexpressSource.id: return [3 /*break*/, 8];
                                    }
                                    return [3 /*break*/, 10];
                                case 6: return [4 /*yield*/, ebay_1.getDetailsFromURL(urlData.url)];
                                case 7:
                                    if (!(_d.sent())) {
                                        productIssues.push("ebay_link_invalid");
                                    }
                                    return [3 /*break*/, 10];
                                case 8: return [4 /*yield*/, aliexpress_1.getDetailsFromURL(urlData.url)];
                                case 9:
                                    if (!(_d.sent())) {
                                        productIssues.push("aliexpress_link_invalid");
                                    }
                                    return [3 /*break*/, 10];
                                case 10:
                                    _i++;
                                    return [3 /*break*/, 5];
                                case 11:
                                    if (!productIssues.length) return [3 /*break*/, 13];
                                    product.product_issues = {};
                                    productIssues.forEach(function (product_issue) {
                                        product.product_issues[product_issue] = true;
                                    });
                                    // Save product as draft
                                    product.status = "draft";
                                    return [4 /*yield*/, strapi.services.product.updateProduct(product.id, { status: "draft", product_issues: product.product_issues }, { price: false, amazonDetails: false }, { change_type: "product_validator_results" })];
                                case 12:
                                    _d.sent();
                                    console.log("Issue(s) were found for [".yellow +
                                        String(product.id).yellow.bold +
                                        ("] " + product.title).yellow);
                                    productsWithIssues.push(product.id);
                                    _d.label = 13;
                                case 13: return [2 /*return*/];
                            }
                        });
                    };
                    i = 0;
                    _a.label = 4;
                case 4:
                    if (!(i < foundProducts.length)) return [3 /*break*/, 7];
                    return [5 /*yield**/, _loop_1(i)];
                case 5:
                    _a.sent();
                    _a.label = 6;
                case 6:
                    i++;
                    return [3 /*break*/, 4];
                case 7: return [2 /*return*/, productsWithIssues];
            }
        });
    });
});
