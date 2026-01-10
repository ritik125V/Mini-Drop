import Image from "next/image";
import defaultImage from "../../resources/logos/default_banner_image.png";
import { div } from "framer-motion/client";

function BannerImage() {
  return (
    <div className="flex justify-center p-1 my-2 ">
      <Image
        className="sm:w-[50%] w-[90%] h-[50%] rounded-3xl"
        src={defaultImage}
        alt="banner"
        width={800}
        height={300}
      />
    </div>
  );
}

export default BannerImage