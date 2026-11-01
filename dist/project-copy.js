// Canonical English archive copy with its complete Chinese counterpart.
export const projectCopy={
  "p1": [
    [
      "Our design covers graphic design, spatial design, visual identity, and digital content production. As project manager, I coordinated the project and all stakeholder communication, and produced digital content and assets.",
      "我们的设计包含：平面设计、空间设计、视觉标识设计、数字内容设计与制作\n我作为项目经理，负责了项目的统筹、所有对接、数字内容和资产的制作"
    ]
  ],
  "p2": [
    [
      "As humanity embarks on the journey toward new homes in space, language evolves alongside interstellar migration, giving rise to a unique \"space language.\" This work uses Mars, the Moon, and Neptune as symbolic anchors, inviting audiences to engage in a cross-planetary cultural exchange experiment—exploring the evolution of language, cognition, and identity. Through this process, the piece calls for reflection on cultural diversity and future coexistence, urging contemplation on the continuity and reconstruction of human civilization amid technological advancement and ecological challenges.",
      "在人类迈向太空新家园的旅途中，语言随着星际迁徙逐渐演化，形成独特的“太空语言”。本作品以火星、月球与海王星为象征，邀请观众参与一场跨星球的文化交流实验，探索语言、认知与身份的演变。通过这一过程，作品呼吁关注文化多样性与未来共生，思考科技与生态挑战下，人类文明的延续与重构。"
    ],
    [
      "The project draws on linguistic relativity and the ways language shapes perception. Katie Paterson's translation of Beethoven's Moonlight Sonata into Morse code, transmitted to the Moon and returned with gaps and delays, also inspired its exploration of interplanetary communication. Linguistic isolation during long journeys and communication delays provides a further point of departure.",
      "《地球公民信笺》的创作灵感源自多重线索：一方面，艺术家受到语言相对论的启发，思考语言结构如何塑造个体对世界的认知；另一方面，Katie Paterson曾经把《月光奏鸣曲》转译成了摩斯电码发送到了月球，经由月表的改编,这个古老的曲调中出现了间隔和停顿,返回地球后在一架钢琴被循环自动播放，以延迟通信与媒介诗学激发了对跨星体交流的想象。此外，长时间太空旅行与通信延迟导致的语言隔离现象也成为构建作品语境的重要基础。"
    ],
    [
      "Set in an imagined early interplanetary civilization, the work explores how migration transforms language, identity and cultural boundaries. Permanent research and residential outposts on Mars, the Moon and Neptune form a decentralized society. Distance and signal delays favor asynchronous communication; AI mediation, delay-tolerant networks and semantic compression coexist with the desire for independent cultural and emotional expression. Physical isolation accelerates the development of distinct languages. The fictional planetary systems emphasize technical expression on Mars, emotional phrases on the Moon, and increasingly abstract expression on distant Neptune. Language becomes a marker of community, memory and linguistic citizenship.",
      "本作品设定于一个人类进入星际文明早期阶段的未来时空，通过构建多星球文化与语言生态的虚拟情境，探讨语言如何在太空迁徙中演化，并塑造新的身份认同与文化边界。\n未来时空背景：\n多星球迁徙时代：人类已在火星、月球、海王星建立长期科研与居住前哨基地。虽然地球仍是文明的母星，但人类社会已进入“多中心”格局。\n通信延迟常态化：由于距离遥远、时差与信号延迟成为常态，传统的“实时交流”机制被迫让位于异步、延迟容忍式的语言系统。\n技术与文化共演：AI语言中介、延迟网络、语义压缩等技术嵌入日常通信，但人类仍在寻求文化与情感层面的自主表达。\n语言分化现实：\n语言演化加速：星际移民社群在长期物理隔离和通信滞后中，逐渐发展出独立的语言系统（“太空语言”），在语法、发音、词汇上与地球语言拉开差距。\n语言自组织机制：每个星球形成具有地域性、功能性特征的语言变体，例如火星的技术密集型表达，月球的情感短语优先机制，海王星则因距地最远而演变出近乎“抽象语音结构”。\n语言身份化趋势：语言不仅是信息工具，更被视为族群标识、记忆载体与文化“防火墙”。星球语言成为新一代殖民者的身份声明（linguistic citizenship）。"
    ]
  ]
};
export function normalizeProjectCopy(projects){for(const p of projects){const pairs=projectCopy[p.id];if(!pairs)continue;if(p.id==='p1')p.introduction=p.introduction.replace(pairs[0][1],pairs[0][0]);else p.introduction=pairs.map(([en])=>en).join('\n\n');}}
