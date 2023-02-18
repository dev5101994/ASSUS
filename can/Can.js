import { Ability, AbilityBuilder } from "@casl/ability";

const ability = new Ability();

const defineRulesFor = (auth) => {
    const permissions = auth ?? [];
    const { can, rules } = new AbilityBuilder();

    if (permissions && Array.isArray(permissions)) {
        permissions?.forEach((p) => {
            // console.log('p.action---------------------------------------++++++++++++++++++=====', p.action)
            let per = p.action.split("-");
            can(p.action, p.subject);
        });
    }

    return rules;

};

export default (type, permissions) => {
    //return true;
    if (type) {
        ability.update(defineRulesFor(permissions));
        return ability.can(type.action, type.subject);
    } else {
        return false
    }

};


