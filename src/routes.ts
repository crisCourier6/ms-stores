import { MainController } from "./controller/MainController"

export const Routes = [{
    method: "get",
    route: "/api/v1/catalogue",
    controller: MainController,
    action: "storeHasFoodAll"
}, {
    method: "get",
    route: "/api/v1/catalogue/bystore/:id",
    controller: MainController,
    action: "storeHasFoodOneByStore"
}, {
    method: "post",
    route: "/api/v1/catalogue",
    controller: MainController,
    action: "storeHasFoodSave"
}, {
    method: "delete",
    route: "/api/v1/catalogue/bystoreandfood/:storeId/:foodLocalId",
    controller: MainController,
    action: "storeHasFoodRemove"
}, {
    method: "patch",
    route: "/api/v1/catalogue/bystore/:id",
    controller: MainController,
    action: "storeHasFoodUpdate"
},
{
    method: "get",
    route: "/api/v1/store-profile",
    controller: MainController,
    action: "storesAll"
},
{
    method: "get",
    route: "/api/v1/store-profile/byUserId/:id",
    controller: MainController,
    action: "storesOneByUserId"
},
{
    method: "get",
    route: "/api/v1/store-profile/byId/:id",
    controller: MainController,
    action: "storesOne"
},
]