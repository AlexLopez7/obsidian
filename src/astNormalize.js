/** @format */

//this where some normilizaiton of the result comes in so we can be normal
import { gql } from "https://deno.land/x/oak_graphql/mod.ts";
import { print, visit } from "https://deno.land/x/graphql_deno/mod.ts";
import { redisdb } from "./quickCache.js";

//graphql response is going to be in JSON;
// this is for breaking up AST feilds/parts into the hash
// and taking the response and pairing the resp info with hash

//idArray so they can define hash nomenclature

//remember to export
function normalizeResult(gqlResponse, idArray = ["id", "__typename"]) {
  const recursiveObjectHashStore = (object, uniqueArray) => {
    const keys = Object.keys(object);
    console.log("keys", keys);
    const isHashable = uniqueArray.every((element) => keys.includes(element));
    console.log("isHashable", isHashable);
    if (isHashable) {
      const hash = "";
      console.log("uniqueArray before forEach", uniqueArray);
      uniqueArray.forEach((id) => hash + id + "~");
      const returnObject = {};
      keys.forEach((key) => {
        if (!uniqueArray.includes(keys)) {
          if (Array.isArray(object[key])) {
            returnObject[hash] = {};
            console.log("returnObject[hash]", returnObject[hash]);
            returnObject[hash][key] = [];
            object[key].forEach((element) => {
              returnObject[hash][key].push(
                recursiveObjectHashStore(element, uniqueArray)
              );
            });
          } else if (typeof object[key] == "object") {
            returnObject[hash] = {};
            returnObject[hash][key] = recursiveObjectHashStore(
              object[key],
              uniqueArray
            );
          } else {
            returnObject[hash] = {};
            returnObject[hash][key] = object[key];
          }
          console.log("returnObject", returnObject);
          //console.log("desired object", [...returnObject]);
          //return returnObject;
          //returnObject[hash] -> is the object we eventually want to return?
        }
      });
      return returnObject;
    } else {
      //if object isn't hashable
      let returnObject = {};
      Object.keys(object).forEach((key) => {
        if (Array.isArray(object[key])) {
          //returnObject = {};
          console.log("returnObject[hash]", returnObject);
          returnObject[key] = [];
          object[key].forEach((element) => {
            returnObject[key].push(
              recursiveObjectHashStore(element, uniqueArray)
            );
          });
        } else if (typeof object[key] == "object") {
          //returnObject = {};
          returnObject[key] = recursiveObjectHashStore(
            object[key],
            uniqueArray
          );
        } else {
          //returnObject = {};
          returnObject[key] = object[key];
        }
        console.log("returnObject", returnObject);
      });
      return returnObject;
    }
    //define hash from idArray (loop through, concatenate all items into one string)
    //define query hash from name,

    //think about whether leave and enter need to be different to track the things

    console.log("inside normalizeResult");
    //console.log("normalizeResult", "Query", query, "GQLresponse", gqlResponse);

    // need to move down
  };

  return recursiveObjectHashStore(gqlResponse, idArray);
}

let test1 = {
  data: {
    movies: [
      {
        id: "7",
        __typename: "Movie",
        title: "Ad Astra",
        releaseYear: 2019,
        genre: "SCIFI",
      },
      {
        id: "15",
        __typename: "Movie",
        title: "World War Z",
        releaseYear: 2013,
        genre: "SCIFI",
      },
      {
        id: "17",
        __typename: "Movie",
        title: "Sky Captain and the World of Tomorrow",
        releaseYear: 2004,
        genre: "SCIFI",
      },
    ],
  },
};

console.log(
  "This is what we realy return",
  normalizeResult(test1, ["id", "__typename"])
);

console.log(JSON.stringify(normalizeResult(test1, ["id", "__typename"])));

/*
    
*/
