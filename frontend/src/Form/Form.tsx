import { useEffect, useState } from "react";
import "./styles.css";
import { FormState } from "../App";
import { BACKEND_URL } from "../consts";

interface FormProps {
  formState: FormState | null;
  setFormState: (state: FormState | null) => void;
  courseNumbers: Record<string, string[]>;
};

const Form: React.FC<FormProps> = ({ formState, setFormState, courseNumbers }) => {


  return (
    <div
      className="flex flex-col justify-evenly h-[200px]"
    >
      <div className="input flex flex-col w-full relative">
        <label className="text-black-500 text-xs font-semibold absolute left-[10px] top-[-8px] px-[3px] bg-white w-fit">
          Subject code
        </label>
        <select
          onChange={(e) => {
            if (e.target.value !== "") setFormState({ subjectCode: e.target.value, courseNumber: null });
            else setFormState(null);
          }}
          className="border-black-500 input px-[10px] py-[11px] text-xs bg-white border-2 rounded-[5px] w-[100%] p-[12px] focus:outline-none placeholder:text-black/25"
        >
          <option value="" disabled selected hidden>
            Choose an option...
          </option>

          { courseNumbers && (
            Object.keys(courseNumbers).map((subjectCode: string) => {
              return <option value={subjectCode}>
                {subjectCode}
              </option>
            }))
          }
        </select>
      </div>

      <div className="input flex flex-col w-full relative">
        <label className="text-black-500 text-xs font-semibold absolute left-[10px] top-[-8px] px-[3px] bg-white w-fit">
          Course number
        </label>
        <select
          onChange={(e) => {
            if (e.target.value !== "" && formState?.subjectCode !== undefined)
              setFormState({ subjectCode: formState.subjectCode, courseNumber: e.target.value });
            else setFormState(null);
          }}
          className="border-black-500 input px-[10px] py-[11px] text-xs bg-white border-2 rounded-[5px] w-[100%] p-[12px] focus:outline-none placeholder:text-black/25"
        >
          <option value="" disabled selected={formState === null || formState?.courseNumber === null} hidden>
            {formState ? "Choose an option..." : "First, choose a subject code"}
          </option>
          {courseNumbers && formState?.subjectCode &&
            courseNumbers[formState.subjectCode].map((courseNumber: string) => {
              return <option value={courseNumber} key={courseNumber}>{courseNumber}</option>;
            })}
        </select>
      </div>
    </div>
  );
};

export default Form;
