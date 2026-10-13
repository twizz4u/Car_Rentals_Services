import { CarDetail } from "../shared/CarDetails";

// Thin proxy so budget cards are always identical to the showroom card.
export const BudgetDetails = ({ data = {} }) => {
  return <CarDetail cardata={data} />;
};

export default BudgetDetails;
