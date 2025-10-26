"use client";

import Link from "next/link";
import type { NextPage } from "next";
import { Logo } from "~~/components/Logo";

const Home: NextPage = () => {
  return (
    <section className="flex items-center flex-col flex-grow pt-10">
      <div className="px-5 flex flex-col gap-2 items-center">
        <h1 className="text-center">
          <span className="flex items-end gap-4 text-5xl font-bold">
            <Logo size={48} /> Week 1: Hello Token + NFT{" "}
          </span>
        </h1>
      </div>

      <div className="flex-grow bg-base-300 w-full mt-16 px-8 py-12">
        <div className="flex justify-center items-center gap-12 flex-col sm:flex-row">
          <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
            <p>
              🟡 MyToken (ERC20) contract <br />
              <code className="text-xs">0x1F9B2fEE142EB06F81bb1B80B5439E82EaA29E79</code> <br />
              <Link
                target="_blank"
                href="https://sepolia-blockscout.lisk.com/token/0x1F9B2fEE142EB06F81bb1B80B5439E82EaA29E79?tab=token_transfers"
                passHref
                className="link"
              >
                Verified on BlockScout
              </Link>
            </p>
          </div>
          <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
            <p>
              🎨 MyNFT (ERC721) contract <br />
              <code className="text-xs">0x0651DD5F097b974f71A8F1065d11B52900CB3Ab5</code> <br />
              <Link
                target="_blank"
                href="https://sepolia-blockscout.lisk.com/address/0x0651DD5F097b974f71A8F1065d11B52900CB3Ab5"
                passHref
                className="link"
              >
                Verified on BlockScout
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;
