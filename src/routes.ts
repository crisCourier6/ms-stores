import { MainController } from "./controller/MainController"

export const Routes = [{
    method: "get",
    route: "/catalogue",
    controller: MainController,
    action: "storeHasFoodAll"
}, {
    method: "get",
    route: "/catalogue/bystore/:id",
    controller: MainController,
    action: "storeHasFoodOneByStore"
}, {
    method: "post",
    route: "/catalogue",
    controller: MainController,
    action: "storeHasFoodSave"
}, {
    method: "delete",
    route: "/catalogue/bystoreandfood/:storeId/:foodLocalId",
    controller: MainController,
    action: "storeHasFoodRemove"
}, {
    method: "patch",
    route: "/catalogue/bystore/:id",
    controller: MainController,
    action: "storeHasFoodUpdate"
},
{
    method: "get",
    route: "/store-profile",
    controller: MainController,
    action: "storesAll"
},
{
    method: "get",
    route: "/store-profile/byUserId/:id",
    controller: MainController,
    action: "storesOneByUserId"
},
{
    method: "get",
    route: "/store-profile/byId/:id",
    controller: MainController,
    action: "storesOne"
},
]