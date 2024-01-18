const clamp = (value, min, max) => {
    if (value < min) return min;
    if (value > max) return max;
    return value;
};

module.exports = {
    clamp,
};
