"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 *
 */
var react_1 = __importDefault(require("react"));
var react_router_dom_1 = require("react-router-dom");
var strapi_helper_plugin_1 = require("strapi-helper-plugin");
// Utils
var pluginId_1 = __importDefault(require("../../pluginId"));
// Containers
var Categories_1 = __importDefault(require("../Categories"));
var CategoryDetail_1 = __importDefault(require("../CategoryDetail"));
var ProductsListing_1 = __importDefault(require("../ProductsListing"));
var ProductDetail_1 = __importDefault(require("../ProductDetail"));
// Components
var LoadingOverlay_1 = __importDefault(require("../../components/LoadingOverlay"));
// Providers
var providers_1 = __importDefault(require("../../providers"));
var ifind_icons_1 = require("ifind-icons");
require("./styles.scss");
var App = function () {
    var goBack = react_router_dom_1.useHistory().goBack;
    return (<div className="ifind-plugin">
      <div hidden dangerouslySetInnerHTML={{ __html: ifind_icons_1.spriteContents }}></div>
        <strapi_helper_plugin_1.BackHeader onClick={goBack}/>
        <providers_1.default>
          <react_router_dom_1.Switch>
            <react_router_dom_1.Route path={"/plugins/" + pluginId_1.default + "/categories"} component={Categories_1.default} exact/>
            <react_router_dom_1.Route path={"/plugins/" + pluginId_1.default + "/categories/create"} component={CategoryDetail_1.default} exact/>
            <react_router_dom_1.Route path={"/plugins/" + pluginId_1.default + "/categories/:categoryId"} component={CategoryDetail_1.default}/>
            <react_router_dom_1.Route path={"/plugins/" + pluginId_1.default + "/products"} component={ProductsListing_1.default} exact/>
            <react_router_dom_1.Route path={"/plugins/" + pluginId_1.default + "/products/create"} component={ProductDetail_1.default} exact/>
            <react_router_dom_1.Route path={"/plugins/" + pluginId_1.default + "/products/:productId"} component={ProductDetail_1.default}/>
            <react_router_dom_1.Route component={strapi_helper_plugin_1.NotFound}/>
          </react_router_dom_1.Switch>
          <LoadingOverlay_1.default />
        </providers_1.default>
    </div>);
};
exports.default = App;
