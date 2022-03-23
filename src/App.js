import logo from "./logo.svg";
import "./App.css";
import { useEffect } from "react";
import DirectWebSdk from "@toruslabs/customauth";
import { getED25519Key } from "@toruslabs/openlogin-ed25519";
import { Account, Connection, clusterApiUrl } from "@solana/web3.js";
import * as bs58 from "bs58";

import nacl from "tweetnacl";

import { Buffer } from "buffer";

export const toBuffer = (arr) => {
  if (Buffer.isBuffer(arr)) {
    return arr;
  } else if (arr instanceof Uint8Array) {
    return Buffer.from(arr.buffer, arr.byteOffset, arr.byteLength);
  } else {
    return Buffer.from(arr);
  }
};

const torus = new DirectWebSdk({
  baseUrl: "http://localhost:3000/serviceworker/",
  network: "testnet", // details for test net
  enableLogging: true,
});

const networks = {
  mainnet: {
    url: "https://api.mainnet-beta.solana.com",
    displayName: "Mainnet Beta",
  },
  devnet: { url: "https://api.devnet.solana.com", displayName: "Devnet" },
  testnet: { url: "https://api.testnet.solana.com", displayName: "Testnet" },
};

const solanaNetwork = networks.devnet;
const connection = new Connection(solanaNetwork.url);

function App() {
  useEffect(() => {
    torus
      .init({ skipSw: true, skipPrefetch: true })
      .then((res) => {
        console.log("WORKED");
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const click = async () => {
    const { privateKey, publicAddress } = await torus.getTorusKey(
      "rhove-custom-auth-test-testnet",
      "22254a6f-e760-4a0e-878a-85542b169859", // user id
      { verifier_id: "22254a6f-e760-4a0e-878a-85542b169859" }, // user id
      "eyJraWQiOiJKbVFJR1o0N2k0aTYwZ1ZwVHVweVZOOFZzNklCaEJLRWN0b1FrWnUzbDZZIiwiYWxnIjoiUlMyNTYifQ.eyJ2ZXIiOjEsImp0aSI6IkFULk5yeEVGN2NZQk1HUXFWZnBlWDBxVEFPdmJ0QXF0cXdGX0pleXI3dEF2Wmsub2FyZWN6ZDRqZlR2eWl5dXE1ZDYiLCJpc3MiOiJodHRwczovL2Rldi0zMjA1MDUzLm9rdGEuY29tL29hdXRoMi9kZWZhdWx0IiwiYXVkIjoiYXBpOi8vZGVmYXVsdCIsImlhdCI6MTY0ODA3MTc3NiwiZXhwIjoxNjQ4MDc1Mzc2LCJjaWQiOiIwb2EyeXQ1dmk4RmJkRWJ0ZjVkNyIsInVpZCI6IjAwdTQzcjU3OWd5cHpNR3dyNWQ3Iiwic2NwIjpbInByb2ZpbGUiLCJvZmZsaW5lX2FjY2VzcyIsIm9wZW5pZCJdLCJhdXRoX3RpbWUiOjE2NDgwNzE3NzYsInN1YiI6ImdyZWcrdGVzdDIyMEByaG92ZS5jb20iLCJncm91cHMiOlsiRXZlcnlvbmUiLCJCZXRhIEFwcCBVc2VycyJdLCJ1c2VySWQiOiIyMjI1NGE2Zi1lNzYwLTRhMGUtODc4YS04NTU0MmIxNjk4NTkifQ.ZfnZ_8KhPXFCqi3Lawyim0GV_aoUgBVF_ddIeyCrGpEGfldW0qdLgilFUQu_uNOU68FqmkYZMNSltrk-g-DsnblUiRH95pp0UvAeToNYEDIGPe5KZlJo6ADrgz130uGs80AhGQ4KSjFwgvJTqRY9y_-aC7KZhWaFyZ7Hkqhz7tMOKrz5cqazy2zTd3tTW9oprS0bKxOs-f9AV_qBiai4ssQhq56akJSxPJUoQh7ZrLSTVwuBsR0gArk1hvQONddS4PZkiseK1KituENE9xIl-HS93SFMBgx-pkqQGr1Zk3ORvvKwBbq_h3S_YX6YJUtzw75MEYB502KVvqA4zKJT0A"
    );
    console.log("TORUS PRIVATE KEY");
    console.log(privateKey);
    const solanaPrivateKey = getSolanaPrivateKey(privateKey);

    console.log("Solana ED25519Key key");
    console.log(solanaPrivateKey);

    const keypair = nacl.sign.keyPair.fromSecretKey(toBuffer(solanaPrivateKey));

    console.log("SOLANA PRIVATE KEY " + bs58.encode(keypair.secretKey));
  };

  const getSolanaPrivateKey = (openloginKey) => {
    const { sk } = getED25519Key(openloginKey);
    return sk;
  };

  return (
    <div className="App">
      <h1>Web 3 auth poc</h1>
      <button onClick={click}>Custom Auth</button>
    </div>
  );
}

export default App;
