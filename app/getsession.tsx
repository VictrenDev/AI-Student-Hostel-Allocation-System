"use client";

import { getCurrentStudent } from "@/src/helpers/get-current-student";

const GetSession = () => {
  const get = async () => {
    const student = await getCurrentStudent();
    console.log(student?.uuid);
  };

  return <button onClick={get}>get session</button>;
};

export default GetSession;
