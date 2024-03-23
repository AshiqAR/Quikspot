import React, {useState, useEffect} from "react";
import {Marker} from "react-native-maps";

export default function ImageMarker({point, title, color, description}) {
  const [shouldTrack, setTrack] = useState(false);
  const [image, setImage] = useState(
    `https://placehold.co/60/${color}/ffffffpng?text=P&font=Montserrat`
  );

  // useEffect(() => {
  //   setTrack(true);
  //   setImage(`https://placehold.co/60/760000/ffffffpng?text=P&font=Montserrat`);
  //   const timeout = setTimeout(() => {
  //     setTrack(false);
  //   }, 600);
  //   return () => clearTimeout(timeout);
  // });

  return (
    <Marker
      image={{uri: image}}
      tracksViewChanges={shouldTrack}
      coordinate={point}
      title={title}
      description={description}
    />
  );
}
