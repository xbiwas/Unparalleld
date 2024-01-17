"use client";

import Search from "@/components/Search/Search";
import TshirtCard from "@/components/TshirtCard/TshirtCard";
import { getTshirts } from "@/lib/apis";
import { Tshirt } from "@/models/tshirt";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import useSWR from "swr";

const Tshirt = () => {
  const [tshirtSizeFilter, setTshirtSizeFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const searchParams = useSearchParams();

  useEffect(() => {
    const searchQuery = searchParams.get("searchQuery");
    const tshirtSize = searchParams.get("tshirtSize");

    if (tshirtSize) setTshirtSizeFilter(tshirtSize);
    if (searchQuery) setSearchQuery(searchQuery);
  }, []);

  async function fetchData() {
    return getTshirts();
  }

  const { data, error, isLoading } = useSWR("get/tshirtSize", fetchData);

  if (error) throw new Error("Cannot fetch data");
  if (typeof data === "undefined" && !isLoading)
    throw new Error("cannot fetch data");

  const filterTshirt = (tshirts: Tshirt[]) => {
    return tshirts.filter((tshirt) => {
      // Apply tshirt filter
      if (
        tshirtSizeFilter &&
        tshirtSizeFilter.toLocaleLowerCase() !== "all" &&
        tshirt.size.toLocaleLowerCase() !== tshirtSizeFilter.toLocaleLowerCase()
      ) {
        return false;
      }

      // apply query filter
      if (
        searchQuery &&
        !tshirt.name
          .toLocaleLowerCase()
          .includes(searchQuery.toLocaleLowerCase())
      ) {
        return false;
      }
      return true;
    });
  };

  const filteredTshirt = filterTshirt(data || []);
  console.log(filteredTshirt);

  return (
    <div>
      <Search
        tshirtSizeFilter={tshirtSizeFilter}
        searchQuery={searchQuery}
        setTshirtSizeFilter={setTshirtSizeFilter}
        setSearchQuery={setSearchQuery}
      />
      <div className="flex t-20 justify-between flex-wrap">
        {filteredTshirt.map((tshirt) => (
          <TshirtCard key={tshirt._id} tshirt={tshirt} />
        ))}
      </div>
    </div>
  );
};
export default Tshirt;