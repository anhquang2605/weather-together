import React from 'react';

interface CityLandScapeProps {

}

const CityLandScape: React.FC<CityLandScapeProps> = ({}) => {
    const SvgCityLandScapeComponent = require(`../../../assets/svg/userProfile/cities/city-landscape.svg`).default;
    return (
        <div className="w-full">
            <SvgCityLandScapeComponent width="100%" preserveAspectRatio="xMidYMid meet" />
        </div>
    );
};

export default CityLandScape;