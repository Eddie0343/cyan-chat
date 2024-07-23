// Utility function to add a delay
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Generic retry function
async function retry(fn, retries = 2, delayMs = 5000) {
  let attempt = 0;
  while (attempt < retries) {
    try {
      return await fn();
    } catch (err) {
      if (attempt === retries - 1) {
        throw err;
      }
      attempt++;
      await delay(delayMs);
    }
  }
}

async function getUserInfo(twitchUserId) {
  return retry(async () => {
    const response = await fetch(
      addRandomQueryString(`https://7tv.io/v3/users/twitch/${twitchUserId}`)
    );
    const data = await response.json();
    const userID = data.user?.id || null;
    const roles = data.user?.roles || [];
    if (data.user) {
      if (data.user.id !== null) {
        // check if the only role is 62b48deb791a15a25c2a0354
        if (!data.user.roles.includes("6076a86b09a4c63a38ebe801")) {
          console.log(twitchUserId, "is not subscribed to 7tv.");
        } else {
          if (!Chat.info.seventvCheckers[twitchUserId]) {
            const data = {
              enabled: true,
              timestamp: Date.now(),
            };
            Chat.info.seventvCheckers[twitchUserId] = data;
          }
        }
      }
      return {
        id: userID,
        roles: roles,
      };
    } else {
      return {
        id: null,
        roles: null,
      };
    }
  });
}

async function isUserSubbed(twitchUserId) {
  const user = await getUserInfo(twitchUserId);
  var subbed = true;
  if (user.roles) {
    if (!user.roles.includes("6076a86b09a4c63a38ebe801")) {
      subbed = false;
      Chat.info.seventvNonSubs[twitchUserId] = true;
    }
  } else {
    Chat.info.seventvNoUsers[twitchUserId] = true;
  }
  return subbed;
}

async function getCosmeticDetails(ids) {
  return retry(async () => {
    const query = {
      operationName: "GetCosmestics",
      variables: { list: ids },
      query: `query GetCosmestics($list: [ObjectID!]) {
              cosmetics(list: $list) {
                paints {
                  id
                  kind
                  name
                  function
                  color
                  angle
                  shape
                  image_url
                  repeat
                  stops {
                    at
                    color
                    __typename
                  }
                  shadows {
                    x_offset
                    y_offset
                    radius
                    color
                    __typename
                  }
                  __typename
                }
                badges {
                  id
                  kind
                  name
                  tooltip
                  tag
                  __typename
                }
                __typename
              }
            }`,
    };

    const response = await fetch(
      addRandomQueryString("https://7tv.io/v3/gql"),
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(query),
      }
    );

    const data = await response.json();
    return data.data.cosmetics;
  });
}

async function getPersonalEmoteData(id) {
  return retry(async () => {
    const query = `
    query MyQuery {
      userByConnection(id: "${id}", platform: TWITCH) {
        emote_sets(entitled: true) {
          id
          name
          flags
        }
      }
    }`;
    const response = await fetch(
      addRandomQueryString("https://7tv.io/v3/gql"),
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      }
    );

    const data = await response.json();
    return data.data.userByConnection;
  });
}

async function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function getUserCosmeticData(id) {
  return retry(async () => {
    const query = `
    query MyQuery {
      userByConnection(id: "${id}", platform: TWITCH) {
        style {
          badge_id
          paint_id
        }
        roles
      }
    }`;
    const response = await fetch(
      addRandomQueryString("https://7tv.io/v3/gql"),
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      }
    );

    const data = await response.json();
    if (data.errors) {
      return null;
    }
    return data.data.userByConnection;
  });
}

async function getUserBadgeAndPaintInfo(twitchUserId) {
  let tries = 5;

  while (tries > 0) {
    // console.log(
    //   `Attempt ${
    //     6 - tries
    //   }/5: Fetching badge and paint info for user ${twitchUserId}`
    // );

    try {
      const sevenTvUserInfo = await getUserCosmeticData(twitchUserId);
      if (sevenTvUserInfo === null) {
        return {
          badge: null,
          paint: null,
        };
      }
      const sevenTvUserRoles = sevenTvUserInfo.roles;
      // check if the only role is 62b48deb791a15a25c2a0354
      if (
        sevenTvUserRoles.length === 1 &&
        sevenTvUserRoles[0] === "62b48deb791a15a25c2a0354"
      ) {
        // console.log(twitchUserId,"is not subscribed to 7tv.")
        return {
          badge: null,
          paint: null,
        };
      }

      const selectedCosmetics = sevenTvUserInfo.style;
      // console.log(
      //   `Selected cosmetics for SevenTv user ${sevenTvUserId}:`,
      //   selectedCosmetics.length
      // );

      if (
        selectedCosmetics.badge_id === null &&
        selectedCosmetics.paint_id === null
      ) {
        // console.log(
        //   `No cosmetics found for user ${sevenTvUserId}. Retrying in 1 second...`
        // );
        await delay(1000);
        tries--;
        continue;
      }

      const badgeCosmetics = selectedCosmetics.badge_id;
      const paintCosmetics = selectedCosmetics.paint_id;

      let badgeDetail = null;
      let paintDetail = null;

      if (badgeCosmetics !== null || paintCosmetics !== null) {
        const cosmeticIds = [badgeCosmetics, paintCosmetics].filter(
          (cosmetic) => cosmetic !== null && cosmetic !== undefined
        );

        const cosmeticDetails = await getCosmeticDetails(cosmeticIds);
        // console.log(
        //   `Cosmetic details fetched for IDs ${cosmeticIds}:`,
        //   cosmeticDetails
        // );

        if (badgeCosmetics !== null) {
          const badgeCosmeticId = badgeCosmetics;
          badgeDetail = cosmeticDetails.badges.find(
            (badge) => badge.id === badgeCosmeticId
          );
          if (badgeDetail) {
            badgeDetail = {
              id: badgeDetail.id,
              tooltip: badgeDetail.tooltip,
            };
            // console.log(`Badge detail found:`, badgeDetail);
          }
        }

        if (paintCosmetics !== null) {
          const paintCosmeticId = paintCosmetics;
          paintDetail = cosmeticDetails.paints.find(
            (paint) => paint.id === paintCosmeticId
          );
          // console.log(`Paint detail found:`, paintDetail);
        }
      }

      if (badgeDetail || paintDetail) {
        // console.log(`Returning badge and paint details.`);
        return {
          badge: badgeDetail,
          paint: paintDetail,
        };
      } else {
        // console.log(`No badge or paint details found. Retrying in 1 second...`);
        await delay(1000);
        tries--;
      }
    } catch (err) {
      // console.error(`Error while fetching data:`, err);
      await delay(1000);
      tries--;
    }
  }

  // console.warn(
  //   `Failed to fetch badge and paint info for user ${twitchUserId} after 5 attempts`
  // );
  return {
    badge: null,
    paint: null,
  };
}

function convertColor(color) {
  const hex = (color < 0 ? 0xffffffff + color + 1 : color)
    .toString(16)
    .padStart(8, "0");
  const rgba = {
    r: parseInt(hex.substring(0, 2), 16),
    g: parseInt(hex.substring(2, 4), 16),
    b: parseInt(hex.substring(4, 6), 16),
    a: parseInt(hex.substring(6, 8), 16) / 255,
  };
  return `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, 1)`; // Force alpha to 1 for the desired output
}

function createGradient(angle, stops, type, repeat) {
  const gradientStops = stops.map(
    (stop) => `${convertColor(stop.color)} ${stop.at * 100}%`
  );
  if (type === "LINEAR_GRADIENT") {
    return `linear-gradient(${angle}deg, ${gradientStops.join(", ")})`;
  } else if (type === "LINEAR_GRADIENT" && repeat) {
    return `repeating-linear-gradient(${gradientStops.join(", ")})`;
  } else if (type === "RADIAL_GRADIENT") {
    return `radial-gradient(${gradientStops.join(", ")})`;
  } else if (type === "RADIAL_GRADIENT" && repeat) {
    return `repeating-radial-gradient(${gradientStops.join(", ")})`;
  } else {
    console.log(`Unknown gradient type: ${type}`);
  }
}

function createDropShadows(shadows) {
  return shadows
    .map((shadow) => {
      const color = convertColor(shadow.color);
      return `drop-shadow(${shadow.x_offset}px ${shadow.y_offset}px ${shadow.radius}px ${color})`;
    })
    .join(" ");
}
