import { Routes, Route } from "@solidjs/router";
import App from "./App";
import test from "./posts/test";

const Page = () => {
  return (
    <>
      <Routes>
        <Route path="/" component={App} />
        <Route path="/test" component={test} />

        <Route path="*" element={<div>not found</div>} />
      </Routes>
    </>
  );
};
export default Page;
