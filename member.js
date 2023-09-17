function skillsMember() {
    var skills = [
        "HTML",
        "CSS",
        "JavaScript",
        "PHP",
        "MySQL",
        "Git",
        "GitHub",
        "Visual Studio Code"
    ];

    var skillsList = document.createElement("ul");
    for (var i = 0; i < skills.length; i++) {
        var skill = document.createElement("li");
        skill.textContent = skills[i];
        skillsList.appendChild(skill);
    }
    return skillsList;
}