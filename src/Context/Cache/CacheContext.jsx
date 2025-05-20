import React, { createContext } from "react";

const CacheContext = createContext();

export class CacheProvider extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            placeCache: new Map(),
            selectedHotel: null,
            selectedPlace: null,
            checkInDate: null,
            checkOutDate: null,
            adults: 1,
            childrenCount: 0,
            rooms: 1,
        };
    }

    setValue = (key, value) => {
        this.setState({ [key]: value });
    };

    render() {
        const contextValue = {
            ...this.state,
            setPlaceCache: (placeCache) => this.setValue("placeCache", placeCache),
            setSelectedHotel: (selectedHotel) => this.setValue("selectedHotel", selectedHotel),
            setSelectedPlace: (selectedPlace) => this.setValue("selectedPlace", selectedPlace),
            setCheckInDate: (checkInDate) => this.setValue("checkInDate", checkInDate),
            setCheckOutDate: (checkOutDate) => this.setValue("checkOutDate", checkOutDate),
            setAdults: (adults) => this.setValue("adults", adults),
            setChildrenCount: (childrenCount) => this.setValue("childrenCount", childrenCount),
            setRooms: (rooms) => this.setValue("rooms", rooms),
        };

        return (
            <CacheContext.Provider value={contextValue}>
                {this.props.children}
            </CacheContext.Provider>
        );
    }
}

export const useCache = () => React.useContext(CacheContext);
