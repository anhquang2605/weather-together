export interface WeatherData {
    columns:       { [key: string]: Column };
    remainingCost: number;
    queryCost:     number;
    messages:      null;
    locations:     Locations;
}

export interface Column {
    id:   string;
    name: string;
    type: number;
    unit: null | string;
}

export interface Locations {
    [key: string]: Location;
}

export interface Location {
    stationContributions: null;
    values:               Value[];
    id:                   string;
    address:              string;
    name:                 string;
    index:                number;
    latitude:             number;
    longitude:            number;
    distance:             number;
    time:                 number;
    tz:                   string;
    currentConditions:    CurrentConditions;
    alerts:               null;
}

export interface CurrentConditions {
    wdir:             number | null;
    temp:             number | null;
    sunrise:          string | null;
    visibility:       number | null;
    wspd:             number | null;
    icon:             string | null;
    stations:         string | null;
    heatindex:        number | null;
    cloudcover:       number | null;
    datetime:         string | null;
    precip:           number | null;
    moonphase:        number | null;
    snowdepth:        null | null;
    sealevelpressure: number | null;
    dew:              number | null;
    sunset:           string | null;
    humidity:         number | null;
    wgust:            null | number;
    windchill:        null | number;
}

export interface Value {
    wdir:             number | null;
    uvindex:          number | null;
    datetimeStr:      string;
    preciptype:       string;
    cin:              number | null;
    cloudcover:       number | null;
    pop:              number | null;
    datetime:         number;
    precip:           number;
    solarradiation:   number | null;
    dew:              number | null;
    humidity:         number | null;
    temp:             number | null;
    visibility:       number | null;
    wspd:             number | null;
    severerisk:       number;
    solarenergy:      number | null;
    heatindex:        number | null;
    snowdepth:        number | null;
    sealevelpressure: number | null;
    snow:             number | null;
    wgust:            number | null;
    conditions:       string;
    windchill:        number | null;
    cape:             number | null;
}

