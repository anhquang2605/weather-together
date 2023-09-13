import React from 'react';

interface CityLandScapeProps {

}

const CityLandScape: React.FC<CityLandScapeProps> = ({}) => {
    const SvgCityLandScapeComponent = require(`../../../assets/svg/userProfile/cities/city-landscape.svg`).default;
    return (
        <div className="w-full -mb-[calc(10%)] z-30">
            <SvgCityLandScapeComponent width="full" />
        </div>
    );
};

export default CityLandScape;