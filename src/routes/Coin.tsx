import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { useEffect, useState } from "react";
import {
  Link,
  Route,
  Routes,
  useLocation,
  useMatch,
  useParams,
} from "react-router-dom";
import styled from "styled-components";
import { fetchCoinInfo, fetchCoinTickers } from "../api";
import Chart from "./Chart";
import Price from "./Price";

const Container = styled.div`
  padding: 0px 20px;
  max-width: 480px;
  margin: 0 auto;
  padding: 20px;
`;
const Header = styled.header`
  height: 10vh;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
`;

const Title = styled.h1`
  font-size: 48px;
  color: ${(props) => props.theme.accentColor};
`;

const Loader = styled.span`
  text-align: center;
  display: block;
`;

const Overview = styled.div`
  display: flex;
  justify-content: space-between;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 10px 20px;
  border-radius: 10px;
`;

const OverviewItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  span:first-child {
    font-size: 10px;
    font-weight: 400;
    text-transform: uppercase;
    margin-bottom: 5px;
  }
`;

const Description = styled.p`
  margin: 20px 0px;
`;

const Tabs = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  margin: 25px 0px;
  gap: 10px;
`;

const Tab = styled.span<{ isActive: boolean }>`
  text-align: center;
  text-transform: uppercase;
  font-size: 12px;
  font-weight: 400;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 7px 0px;
  border-radius: 10px;
  color: ${(props) =>
    props.isActive ? props.theme.accentColor : props.theme.textColor};
  a {
    display: block;
  }
`;

interface RouteParams {
  coinId: string;
}

interface Location {
  state: {
    name: string;
  };
}

// IInfoData 이렇게 선언가능. 이러면 인터페이스인 거 손쉽게 예측가능
interface InfoData {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  is_new: boolean;
  is_active: boolean;
  type: string;
  logo: string;
  //tags: object; in this case, ITag[] 하고 인터페이스 추가로 선언해주고 여기에 붙여줌. 이 프로젝트에선 필요없어서 지워버림

  description: string;
  message: string;
  open_source: boolean;
  started_at: string;
  development_status: string;
  hardware_wallet: boolean;
  proof_type: string;
  org_structure: string;
  hash_algorithm: string;
  first_data_at: string;
  last_data_at: string;
}

interface PriceData {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number;
  beta_value: number;
  first_data_at: string;
  last_updated: string;
  quotes: {
    USD: {
      ath_date: string;
      ath_price: number;
      market_cap: number;
      market_cap_change_24h: number;
      percent_change_1h: number;
      percent_change_1y: number;
      percent_change_6h: number;
      percent_change_7d: number;
      percent_change_12h: number;
      percent_change_15m: number;
      percent_change_24h: number;
      percent_change_30d: number;
      percent_change_30m: number;
      percent_from_price_ath: number;
      price: number;
      volume_24h: number;
      volume_24h_change_24h: number;
    };
  };
}

function Coin() {
  const { coinId } = useParams<{ coinId: string }>();
  const { state } = useLocation() as Location;
  const priceMatch = useMatch("/:coinId/price");
  const chartMatch = useMatch("/:coinId/chart");
  // 쿼리쓸때, 쿼리에서 제공하는 로딩값 변수이름 중복되지 않게 바꾸어서 설정
  const { isLoading: infoLoading, data: infoData } = useQuery<InfoData>(
    ["info", coinId],
    () => fetchCoinInfo(coinId)
  );
  const { isLoading: tickersLoading, data: tickersData } = useQuery<PriceData>(
    ["tickers", coinId],
    () => fetchCoinTickers(coinId),
    {
      refetchInterval: 5000, //5초마다 데이터 fetch
    }
  );
  // const [loading, setLoading] = useState(true);
  // const [info, setInfo] = useState<InfoData>();
  // const [priceInfo, setPriceInfo] = useState<PriceData>();
  // useEffect(() => {
  //   (async () => {
  //     const infoData = await (
  //       await fetch(`https://api.coinpaprika.com/v1/coins/${coinId}`)
  //     ).json();
  //     const priceData = await (
  //       await fetch(`https://api.coinpaprika.com/v1/tickers/${coinId}`)
  //     ).json();
  //     setInfo(infoData);
  //     setPriceInfo(priceData);
  //     setLoading(false);
  //   })();
  // }, [coinId]);
  const loading = infoLoading || tickersLoading;
  return (
    <Container>
      <Helmet>
        <title>
          {state?.name ? state.name : loading ? "loading..." : infoData?.name}
        </title>
      </Helmet>
      <Header>
        <Title>
          {state?.name ? state.name : loading ? "loading..." : infoData?.name}
          {/* state에 name이 있다면, state.name 출력 or loading 트루라면 로딩...출력, 아니면 인포의 네임 출력  */}
          {/* optional chaning syntax. prevent error  */}
        </Title>
      </Header>
      {loading ? <Loader>Loading...</Loader> : null}
      <Overview>
        <OverviewItem>
          <span>rank:</span>
          <span>{infoData?.rank}</span>
        </OverviewItem>
        <OverviewItem>
          <span>symbol:</span>
          <span>{infoData?.symbol}</span>
        </OverviewItem>
        <OverviewItem>
          <span>Price:</span>
          <span>${tickersData?.quotes.USD.price.toFixed(3)}</span>
        </OverviewItem>
      </Overview>
      <Description>{infoData?.description}</Description>
      <Overview>
        <OverviewItem>
          <span>Total supply:</span>
          <span>{tickersData?.total_supply}</span>
        </OverviewItem>
        <OverviewItem>
          <span>max supply:</span>
          <span>{tickersData?.max_supply}</span>
        </OverviewItem>
      </Overview>

      <Tabs>
        <Tab isActive={chartMatch !== null}>
          <Link to={`/${coinId}/chart`}>Chart</Link>
        </Tab>
        <Tab isActive={priceMatch !== null}>
          <Link to={`/${coinId}/price`}>Price</Link>
        </Tab>
      </Tabs>

      <Routes>
        <Route path="price" element={<Price />}></Route>
        <Route path="chart" element={<Chart />}></Route>
      </Routes>
    </Container>
  );
}

export default Coin;
