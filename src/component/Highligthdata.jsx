import { CarDetail } from "./CarDetails";

// Thin proxy so highlight cards are always identical to the showroom card.
export const HighligthData = ({ data = {} }) => {
  return <CarDetail cardata={data} />;
};

export default HighligthData;
