const pathMatch = require('path-match')({});
import parseUrl from "parseurl";
import RemakeStore from "../lib/remake-store";
import { capture } from "./async-utils";
import { doesPageExist } from "./page-utils";

/*
  Remake has 3 types of routes
  • BaseRoute
  • UsernameRoute
  • ItemRoute

  Combined, these routes can render these patterns:
  • /
  • /pageName
  • /username
  • /username/pageName/
  • /username/pageName/id

  Remake has two url formats
  • Single tenant: domain/firstParam/secondParam/thirdParam
  • Multi tenant: subdomain.domain/firstParam/secondParam/thirdParam
*/

export async function getParams ({req}) {
  let {firstParam, secondParam, thirdParam} = req.urlData.pageParams;
  let username, pageName, itemId;

  if (!firstParam) {
    // route: /
    pageName = "index";
  } else if (!secondParam) {
    let [pageExists] = await capture(doesPageExist({
      appName: req.appName, 
      pageName: firstParam
    }));
    
    if (pageExists) {
      // route: /pageName 
      pageName = firstParam;
    } else {
      // route: /username
      username = firstParam;
      pageName = "index";
    }
  } else {
    // route: /username/pageName/
    // and
    // route: /username/pageName/id
    [username, pageName, itemId] = [firstParam, secondParam, thirdParam];
  }

  return {username, pageName, itemId};
}

