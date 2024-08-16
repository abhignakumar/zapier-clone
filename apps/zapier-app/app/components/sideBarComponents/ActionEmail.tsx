import { InputBox } from "@repo/ui/InputBox";

export const ActionEmail = ({
  onChange,
  metaData,
}: {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  metaData: any;
}) => {
  return (
    <div>
      <div>
        <InputBox
          inputId="action-email-input-to"
          label="To"
          placeholder="Enter 'to' email address"
          onChange={onChange}
          inputValue={metaData?.to || ""}
        />
      </div>
      <div>
        <InputBox
          inputId="action-email-input-body"
          label="Body"
          placeholder="Enter body of the email"
          onChange={onChange}
          inputValue={metaData?.body || ""}
        />
      </div>
    </div>
  );
};
