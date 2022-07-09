import { FC } from "react";

// TODO: Use the ListTemplate to build this page.
//       Specify a custom form to handle all the page permission toggling.
//       Specify the item subtext to show a number of emojis equal to the number of permissions it has.

// TODO: Create a role for every single collection in the MongoDB App Services UI.
//       Each collection should only grant read and write permissions to users with the corresponding access level.

// NOTE: The staff collection is an exception. 
//       It should also have document-level permissions; To give read permissions to users of with a matching name.

const AccessLevels: FC = () => {
  return (
    <div>access levels</div>
  );
}

export default AccessLevels;
