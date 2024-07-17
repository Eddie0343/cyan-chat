// Utility function to add a delay
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Generic retry function
async function retry(fn, retries = 5, delayMs = 1000) {
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

// Step 1: Get 7TV user ID using Twitch user ID
async function getUserInfo(twitchUserId) {
  return retry(async () => {
    const response = await fetch(
      addRandomQueryString(`https://7tv.io/v3/users/twitch/${twitchUserId}`)
    );
    const data = await response.json();
    return data.emote_set?.id || null;
  });
}

// Step 2: Get cosmetics for the 7TV user ID
async function getUserCosmetics(sevenTvUserId) {
  return retry(async () => {
    const query = {
      operationName: "GetUserCosmetics",
      variables: { id: sevenTvUserId },
      query: `query GetUserCosmetics($id: ObjectID!) {
              user(id: $id) {
                id
                cosmetics {
                  id
                  kind
                  selected
                  __typename
                }
                __typename
              }
            }`,
    };

    const response = await fetch(addRandomQueryString("https://7tv.io/v3/gql"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(query),
    });

    const data = await response.json();
    return data.data.user.cosmetics.filter((cosmetic) => cosmetic.selected);
  });
}

// Step 3: Get detailed information about cosmetics
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

    const response = await fetch(addRandomQueryString("https://7tv.io/v3/gql"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(query),
    });

    const data = await response.json();
    return data.data.cosmetics;
  });
}

// Function to get the user's badge URL
async function getBadgeUrl(twitchUserId) {
  try {
    const sevenTvUserId = await getUserInfo(twitchUserId);
    if (sevenTvUserId === null) return null;

    const selectedCosmetics = await getUserCosmetics(sevenTvUserId);

    const badgeCosmetics = selectedCosmetics.filter(
      (cosmetic) => cosmetic.kind === "BADGE"
    );
    if (badgeCosmetics.length === 0) return null;

    const cosmeticDetails = await getCosmeticDetails(
      badgeCosmetics.map((c) => c.id)
    );

    const badgeDetail = cosmeticDetails.badges.find(
      (badge) => badge.id === badgeCosmetics[0].id
    );

    return badgeDetail ? badgeDetail.tag : null;
  } catch (err) {
    return null;
  }
}

async function getBadgeInfo(twitchUserId) {
  try {
    const sevenTvUserId = await getUserInfo(twitchUserId);
    if (sevenTvUserId === null) return null;
    
    const selectedCosmetics = await getUserCosmetics(sevenTvUserId);
    if (selectedCosmetics.length === 0) return null;

    const badgeCosmetics = selectedCosmetics.filter(
        (cosmetic) => cosmetic.kind === "BADGE"
    );
    if (badgeCosmetics.length === 0) return null;

    const cosmeticDetails = await getCosmeticDetails(
        badgeCosmetics.map((c) => c.id)
    );

    const badgeDetail = cosmeticDetails.badges.find(
        (badge) => badge.id === badgeCosmetics[0].id
    );

    if (badgeDetail) {
      return {
        id: badgeDetail.id,
        tooltip: badgeDetail.tooltip,
      };
    } else {
      return null;
    }
  } catch (err) {
    return null;
  }
}

// Function to get the user's name paint info
async function getNamePaintInfo(twitchUserId) {
  try {
    const sevenTvUserId = await getUserInfo(twitchUserId);
    if (sevenTvUserId === null) return null;
    
    const selectedCosmetics = await getUserCosmetics(sevenTvUserId);
    if (selectedCosmetics.length === 0) return null;

    const paintCosmetics = selectedCosmetics.filter(
        (cosmetic) => cosmetic.kind === "PAINT"
    );
    if (paintCosmetics.length === 0) return null;

    const cosmeticDetails = await getCosmeticDetails(
        paintCosmetics.map((c) => c.id)
    );

    const paintDetail = cosmeticDetails.paints.find(
        (paint) => paint.id === paintCosmetics[0].id
    );

    return paintDetail || null;
  } catch (err) {
    return null;
  }
}

async function getUserBadgeAndPaintInfo(twitchUserId) {
  try {
    const sevenTvUserId = await getUserInfo(twitchUserId);
    if (sevenTvUserId === null) {
      return {
        badge: null,
        paint: null,
      };
    }

    const selectedCosmetics = await getUserCosmetics(sevenTvUserId);
    if (selectedCosmetics.length === 0) {
      return {
        badge: null,
        paint: null,
      };
    }

    const badgeCosmetics = selectedCosmetics.filter(
        (cosmetic) => cosmetic.kind === "BADGE"
    );
    const paintCosmetics = selectedCosmetics.filter(
        (cosmetic) => cosmetic.kind === "PAINT"
    );

    let badgeDetail = null;
    let paintDetail = null;

    if (badgeCosmetics.length > 0 || paintCosmetics.length > 0) {
      const cosmeticIds = [
        ...badgeCosmetics.map((c) => c.id),
        ...paintCosmetics.map((c) => c.id),
      ];

      const cosmeticDetails = await getCosmeticDetails(cosmeticIds);

      if (badgeCosmetics.length > 0) {
        const badgeCosmeticId = badgeCosmetics[0].id;
        badgeDetail = cosmeticDetails.badges.find(
            (badge) => badge.id === badgeCosmeticId
        );
        if (badgeDetail) {
          badgeDetail = {
            id: badgeDetail.id,
            tooltip: badgeDetail.tooltip,
          };
        }
      }

      if (paintCosmetics.length > 0) {
        const paintCosmeticId = paintCosmetics[0].id;
        paintDetail = cosmeticDetails.paints.find(
            (paint) => paint.id === paintCosmeticId
        );
      }
    }

    return {
      badge: badgeDetail,
      paint: paintDetail,
    };
  } catch (err) {
    return {
      badge: null,
      paint: null,
    };
  }
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

function createGradient(angle, stops, type) {
  const gradientStops = stops.map(
    (stop) => `${convertColor(stop.color)} ${stop.at * 100}%`
  );
  if (type === "LINEAR_GRADIENT") {
    return `linear-gradient(${angle}deg, ${gradientStops.join(", ")})`;
  } else {
    return `radial-gradient(${gradientStops.join(", ")})`;
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
