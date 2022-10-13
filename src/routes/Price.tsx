import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { fetchCoinHistory } from "../api";
import PropTypes, { InferProps } from "prop-types";
import styled from "styled-components";

interface IHistoricalData {
  time_open: number;
  time_close: number;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
  market_cap: number;
}
Price.propType = {
  currentPrice: PropTypes.number,
};

const Container = styled.div`
  padding: 0px 40px;
  max-width: 480px;
  margin: 0 auto;
`;

const PriceUl = styled.ul``;

const PriceLi = styled.li`
  display: flex;
  justify-content: space-between;
  padding: 10px;
  span: nth-child(2) {
    font-weight: 600;
  }
`;

const Loader = styled.span`
  text-align: center;
  display: block;
`;

function Price({ currentPrice }: InferProps<typeof Price.propType>) {
  const { coinId } = useParams<"coinId">();
  const { isLoading, data } = useQuery<IHistoricalData[]>(
    ["ohlcv", coinId],
    () => fetchCoinHistory(coinId)
  );
  const todayPriceData = data?.pop();

  return (
    <Container>
      {isLoading ? <Loader>Loading...</Loader> : null}
      <PriceUl>
        <PriceLi>
          <span>Current Price</span>
          <span>${currentPrice}</span>
        </PriceLi>
        <PriceLi>
          <span>Open Price</span>
          <span>${todayPriceData?.open}</span>
        </PriceLi>
        <PriceLi>
          <span>Close Price</span>
          <span>${todayPriceData?.close}</span>
        </PriceLi>
        <PriceLi>
          <span>High Price</span>
          <span>${todayPriceData?.high}</span>
        </PriceLi>
        <PriceLi>
          <span>Low Price</span>
          <span>${todayPriceData?.low}</span>
        </PriceLi>
      </PriceUl>
    </Container>
  );
}

export default Price;
