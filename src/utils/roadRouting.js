export async function getRoadRoute(points) {
  if (!points || points.length < 2) {
    return {
      coordinates: [],
      distanceKm: 0,
    };
  }

  const coordinates = points
    .map(
      (point) =>
        `${point.longitude},${point.latitude}`
    )
    .join(";");

  const url =
    `https://router.project-osrm.org/route/v1/driving/` +
    `${coordinates}` +
    `?overview=full&geometries=geojson`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(
        "OSRM routing request failed"
      );
    }

    const data = await response.json();

    if (
      !data.routes ||
      data.routes.length === 0
    ) {
      throw new Error(
        "No route returned"
      );
    }

    const route = data.routes[0];

    const roadCoordinates =
      route.geometry.coordinates.map(
        ([longitude, latitude]) => [
          latitude,
          longitude,
        ]
      );

    return {
      coordinates: roadCoordinates,

      distanceKm: Number(
        (route.distance / 1000).toFixed(2)
      ),

      durationMinutes: Number(
        (route.duration / 60).toFixed(1)
      ),
    };
  } catch (error) {
    console.error(
      "Road routing error:",
      error
    );

    return {
      coordinates: [],
      distanceKm: 0,
      durationMinutes: 0,
    };
  }
}