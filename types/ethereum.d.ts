type EthereumRequestArgs = {
  method: string;
  params?: unknown[];
};

type EthereumProvider = {
  isMetaMask?: boolean;
  request: <T = unknown>(args: EthereumRequestArgs) => Promise<T>;
  on?: (event: "accountsChanged" | "chainChanged", handler: (...args: unknown[]) => void) => void;
  removeListener?: (event: "accountsChanged" | "chainChanged", handler: (...args: unknown[]) => void) => void;
};

interface Window {
  ethereum?: EthereumProvider;
}
