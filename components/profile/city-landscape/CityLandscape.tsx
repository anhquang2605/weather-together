import React from 'react';

interface CityLandScapeProps {

}

const CityLandScape: React.FC<CityLandScapeProps> = ({}) => {
    const SvgCityLandScapeComponent = require(`../../../assets/svg/userProfile/cities/city-landscape.svg`).default;
    return (
        <div className="w-full -mb-[60px] z-30">
            <SvgCityLandScapeComponent width="full" />
        </div>
    );
};

export default CityLandScape;